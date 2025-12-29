import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  DefaultComponents,
  DefaultComponentWeights,
} from '../../../constants/default-components.enum';
import { Module } from '../../../constants/module.model';
import { ModuleService } from '../../../service/module.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-module',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-module.component.html',
  styleUrl: './add-module.component.css',
})
export class AddModuleComponent implements OnInit {
  moduleType!: number;
  weightError = false;
  showComponents = false;

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private router: Router
  ) {
    this.form = this.fb.group({
      moduleCode: ['', Validators.required],
      moduleName: ['', Validators.required],
      componentCount: [null],
      components: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.moduleType = +params['type'];

      if (this.moduleType === 1) {
        this.addDefaultComponents();
        this.showComponents = true;
      }
    });

    // React to componentCount changes automatically
    this.form.get('componentCount')?.valueChanges.subscribe((count) => {
      //moduleType - 2 has customized components
      if (this.moduleType !== 2) return;

      this.components.clear();
      this.weightError = false;

      if (!count || count <= 0) {
        this.showComponents = false;
        return;
      }

      this.showComponents = true;

      for (let i = 0; i < count; i++) {
        this.components.push(
          this.fb.group({
            componentName: ['', Validators.required],
            componentWeight: [
              null,
              [
                Validators.required,
                Validators.min(0),
                Validators.max(100),
                Validators.pattern(/^\d+$/),
              ],
            ],
          })
        );
      }
    });
  }

  get components(): FormArray {
    return this.form.get('components') as FormArray;
  }

  //if the type of the component is default, the default components will be added as the components
  private addDefaultComponents(): void {
    this.components.clear();

    const defaultNames = Object.values(DefaultComponents);

    defaultNames.forEach((name) => {
      this.components.push(
        this.fb.group({
          componentName: [name, Validators.required],
          componentWeight: [DefaultComponentWeights[name], Validators.required],
        })
      );
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    //total weight is calculated by adding the componentWeigt of each component
    const totalWeight = this.components.controls
      .map((c) => c.value.componentWeight || 0)
      .reduce((a, b) => a + b, 0);

    //check whether the total weight is 100
    if (totalWeight !== 100) {
      this.weightError = true;
      return;
    }

    //set the moduleDetails from the form data
    //student count is set to zero initially
    const moduleDetails: Module = {
      moduleCode: this.form.value.moduleCode,
      moduleName: this.form.value.moduleName,
      studentCount: 0,
      components: this.form.value.components,
    };

    this.moduleService.addModule(moduleDetails).subscribe({
      next: (res) => {
        this.form.reset(); //reset the form
        this.components.clear();
        this.showComponents = false;
        this.router.navigate(['']); //goes to home page
      },
      error: (err) => {
        console.error('Error adding module', err);
      },
    });
  }
}
