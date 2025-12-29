import { Routes } from '@angular/router';
import { ModuleComponent } from './components/module/module.component';
import { StudentsComponent } from './components/students/students.component';
import { AddModuleComponent } from './components/module/add-module/add-module.component';
import { AddStudentComponent } from './components/students/add-student/add-student.component';
import { LoadStudentsFromFileComponent } from './components/students/load-students-from-file/load-students-from-file.component';

export const routes: Routes = [
  { path: '', component: ModuleComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'addModule', component: AddModuleComponent },
  { path: 'addStudent', component: AddStudentComponent },
  { path: 'loadFromFile', component: LoadStudentsFromFileComponent },
];
