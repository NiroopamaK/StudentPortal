import { Component, OnInit } from '@angular/core';
import { Student } from '../../../constants/student.model';
import { ModuleService } from '../../../service/module.service';
import { StudentService } from '../../../service/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Module } from '../../../constants/module.model';
import { component } from '../../../constants/component.model';
import { categories, boundaries } from '../../../constants/category.model';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css',
})
export class AddStudentComponent implements OnInit {
  student!: Student;
  moduleCode!: string;
  module!: Module;
  form: FormGroup;

  constructor(
    private moduleService: ModuleService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      //set the form values
      studentId: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
      studentName: ['', Validators.required],
      dob: [null, Validators.required],
      scores: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.student = {} as Student;
    this.route.queryParams.subscribe((params) => {
      this.moduleCode = params['moduleCode'];
      this.loadModule(); //get the module details
    });
  }

  get scores(): FormArray {
    return this.form.get('scores') as FormArray;
  }

  loadModule() {
    this.moduleService.getModuleByModuleCode(this.moduleCode).subscribe({
      next: (module: Module) => {
        this.module = module;
        this.initScoresForm();
      },
      error: (err) => console.error(err),
    });
  }

  initScoresForm() {
    this.scores.clear();
    this.module.components.forEach((comp: component) => {
      this.scores.push(
        this.fb.group({
          componentName: [comp.componentName],
          componentWeight: [comp.componentWeight],
          componentScore: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
        })
      );
    });
  }

  //get age
  setAge(dob: string | Date): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  }

  //calculate overall score
  calculateOverallScore(): number {
    let total = 0;

    for (const group of this.scores.controls) {
      const score = group.get('componentScore')?.value || 0;
      const weight = group.get('componentWeight')?.value || 0;
      total += score * (weight / 100);
    }

    return total;
  }

  //round the score to the nearest boundary value
  roundToCategory(overallScore: number): number {
    for (let i = 0; i < boundaries.length - 1; i++) {
      const lower = boundaries[i];
      const upper = boundaries[i + 1];
      if (overallScore >= lower && overallScore <= upper) {
        return overallScore - lower >= upper - overallScore ? upper : lower;
      }
    }
    return overallScore;
  }

  //get the category
  getCategory(score: number): string {
    const category = categories.find(
      (cat) => score >= cat.min && score <= cat.max
    );
    return category ? category.label : 'Unknown';
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.student.studentId = this.form.value.studentId;
    this.student.studentName = this.form.value.studentName;
    const rawDate = this.form.value.dob;
    const dateObj = new Date(rawDate);
    this.student.dob = dateObj.toISOString().split('T')[0];

    this.student.age = String(this.setAge(this.student.dob)) + ' years';
    this.student.moduleCode = this.moduleCode;
    this.student.overallScore = this.calculateOverallScore();
    this.student.rawScore = this.roundToCategory(this.student.overallScore);
    this.student.category = this.getCategory(this.student.rawScore);

    this.studentService.addStudent(this.student).subscribe({
      next: () => {
        this.snackBar.open('Student added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        // Reset only the student info fields
        this.form.patchValue({
          studentId: '',
          studentName: '',
          dob: null,
        });

        // Reset all scores but keep componentName and componentWeight
        this.scores.controls.forEach((group) => {
          group.get('componentScore')?.reset();
        });

        // Mark the whole form as pristine and untouched
        //if not validation errors will be displayed
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.scores.markAsPristine();
        this.scores.markAsUntouched();
      },
      error: (err) => {
        this.snackBar.open('Failed to add student', 'Close', {
          duration: 3000,
        });
        console.error('Error adding student', err);
      },
    });
  }

  viewStudentsClick() {
    this.router.navigate(['/students'], {
      queryParams: { moduleCode: this.moduleCode },
    });
  }

  gotoModulesClick() {
    this.router.navigate(['']);
  }
}
