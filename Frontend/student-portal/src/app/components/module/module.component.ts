import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModuleService } from '../../service/module.service';
import { Module } from '../../constants/module.model';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog-components/dialog/dialog.component';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})
export class ModuleComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'moduleCode',
    'moduleName',
    'addStudents',
    'viewStudents',
    'deleteModule',
  ];
  isAddClickDisabled = false;

  dataSource = new MatTableDataSource<Module>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private moduleService: ModuleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllModules();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  //get all the available modules and set them to datasource
  getAllModules(): void {
    this.moduleService.getAllModules().subscribe((modules) => {
      this.dataSource.data = modules;
      console.log(this.dataSource);

      // Ensure paginator exists in DOM before assigning
      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.firstPage(); // Optional: reset page
        }
      });
    });
  }

  //when add module is clicked, dialog component will be opened
  //can choose between configuring a new module or creating as default
  addModuleClick(): void {
    this.isAddClickDisabled = true;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Add a New Module',
        message: 'Do you want to configure this module now?',
        firstButtonText: 'Yes',
        secondButtonText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      this.isAddClickDisabled = false;

      if (result === 1 || result === 2) {
        this.router.navigate(['/addModule'], {
          queryParams: { type: result },
        });
      }
    });
  }

  //when addStudent is clicked DialogComponent will be called
  //user is given the options to add students manually or load from a file
  addStudentClick(moduleCode: string) {
    console.log(moduleCode);

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Add Students',
        message:
          'Do you want to add students manually or load them from a file?',
        firstButtonText: 'Load from file',
        secondButtonText: 'Add manually',
      },
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result === 1) {
        this.router.navigate(['/addStudent'], {
          queryParams: { moduleCode },
        });
      }

      if (result === 2) {
        this.router.navigate(['/loadFromFile'], {
          queryParams: { moduleCode },
        });
      }
    });
  }

  //Goes to the page which shows all the students added for each module
  viewStudentsClick(moduleCode: string): void {
    this.router.navigate(['/students'], { queryParams: { moduleCode } });
  }

  //Module will be allowed to delete only if the student count is zero
  //If a module has students, then the module will not be allowed to be deleted
  deleteModule(moduleCode: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Module',
        message: 'Do you want to add delete the module?',
        firstButtonText: 'No',
        secondButtonText: 'Yes',
      },
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result == 1) {
        this.moduleService.deleteModule(moduleCode).subscribe({
          next: () => {
            this.snackBar.open('Module deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.getAllModules();
          },
          error: () => {
            this.snackBar.open('Failed to delete module', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
