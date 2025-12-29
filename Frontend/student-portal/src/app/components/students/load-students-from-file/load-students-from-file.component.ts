import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from '../../../service/module.service';
import { StudentService } from '../../../service/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Module } from '../../../constants/module.model';
import { Student } from '../../../constants/student.model';
import { component } from '../../../constants/component.model';
import { boundaries, categories } from '../../../constants/category.model';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-load-students-from-file',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './load-students-from-file.component.html',
  styleUrls: ['./load-students-from-file.component.css'],
})
export class LoadStudentsFromFileComponent implements AfterViewInit {
  moduleCode!: string;
  module!: Module;

  displayedColumns: string[] = [
    'studentId',
    'studentName',
    'dob',
    'age',
    'overallScore',
    'rawScore',
    'category',
  ];

  students: Student[] = [];
  dataSource = new MatTableDataSource<Student>([]);
  componentMismatchError: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.moduleCode = params['moduleCode'];
      this.getModuleDetails(this.moduleCode);
    });
  }

  getModuleDetails(moduleCode: string) {
    this.moduleService.getModuleByModuleCode(moduleCode).subscribe({
      next: (module: Module) => {
        this.module = module;
      },
    });
  }

  //read the file
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('Only .txt files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      this.parseTxtData(text);
    };
    reader.readAsText(file);
  }

  //parse text data to student datasource
  private parseTxtData(content: string) {
    if (!this.module?.components?.length) return;

    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');
    const componentsCount = this.module.components.length;

    this.students = []; // reset previous students
    this.componentMismatchError = ''; // reset error

    lines.forEach((line, index) => {
      const parts = line.split(',');
      const scores = parts.slice(3).map(Number);

      if (scores.length !== componentsCount) {
        this.componentMismatchError = `Number of scores (${scores.length}) does not match number of components (${componentsCount}).`;
        console.error(this.componentMismatchError);
        return;
      }

      const student: Student = {
        studentId: parts[0],
        studentName: parts[1],
        dob: parts[2],
        age: '',
        moduleCode: this.module.moduleCode,
        rawScore: 0,
        overallScore: 0,
        category: '',
      };

      student.overallScore = this.calculateOverallScore(
        scores,
        this.module.components
      );
      student.rawScore = this.roundToBoundary(student.overallScore);
      student.category = this.getCategory(student.rawScore);
      student.age = String(this.setAge(student.dob)) + ' Years';

      this.students.push(student);
    });

    this.dataSource.data = this.students;
    this.dataSource.paginator?.firstPage();
  }

  private calculateOverallScore(
    scores: number[],
    components: component[]
  ): number {
    let total = 0;
    scores.forEach((score, i) => {
      const weight = components[i].componentWeight;
      total += score * (weight / 100);
    });
    return total;
  }

  private roundToBoundary(overallScore: number): number {
    let nearest = overallScore;
    for (let i = 0; i < boundaries.length - 1; i++) {
      const lower = boundaries[i];
      const upper = boundaries[i + 1];
      if (overallScore >= lower && overallScore <= upper) {
        nearest = overallScore - lower >= upper - overallScore ? upper : lower;
        break;
      }
    }
    return nearest;
  }

  private getCategory(score: number): string {
    const cat = categories.find((c) => score >= c.min && score <= c.max);
    return cat ? cat.label : 'Unknown';
  }

  private setAge(dob: Date | string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  }

  saveStudentsClick(students: Student[]) {
    this.studentService.addStudents(students).subscribe({
      next: () => {
        this.snackBar.open('Students added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to add students', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
