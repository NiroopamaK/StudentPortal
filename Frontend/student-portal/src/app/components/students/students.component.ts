import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModuleService } from '../../service/module.service';
import { StudentService } from '../../service/student.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Module } from '../../constants/module.model';
import { Student } from '../../constants/student.model';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DialogComponent } from '../dialog-components/dialog/dialog.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    RouterModule,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit {
  module!: Module;
  students: Student[] = [];
  displayedColumns: string[] = [
    'studentId',
    'studentName',
    'dob',
    'age',
    'overallScore',
    'rawScore',
    'category',
    'deleteStudent',
  ];

  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private moduleService: ModuleService,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const moduleCode = params['moduleCode'];
      this.getModuleDetails(moduleCode);
      this.getAllStudents(moduleCode);
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getModuleDetails(moduleCode: string) {
    this.moduleService.getModuleByModuleCode(moduleCode).subscribe({
      next: (module: Module) => {
        this.module = module;
      },
      error: (err) => {
        console.error('Error fetching module details', err);
      },
    });
  }

  getAllStudents(moduleCode: string) {
    this.studentService.getAllStudents(moduleCode).subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.dataSource.data = this.students;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
    });
  }

  deleteStudentClick(studentId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Student',
        message: 'Do you want to add delete the student?',
        firstButtonText: 'No',
        secondButtonText: 'Yes',
      },
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result == 1) {
        this.studentService.deleteStudent(studentId).subscribe({
          next: () => {
            this.snackBar.open('Student deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.getAllStudents(this.module.moduleCode);
          },
          error: () => {
            this.snackBar.open('Failed to delete student', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  downloadTable(): void {
    this.downloadFilteredStudentsAsTxt();
  }

  downloadFilteredStudentsAsTxt(): void {
    // Get headers from student object
    //remove moduleCode from the students[]
    const columns = (Object.keys(this.students[0]) as (keyof Student)[]).filter(
      (col) => col !== 'moduleCode'
    );

    // Converts all the values to string
    // So .padEnd will not give an error
    const formatValue = (value: any): string => String(value);

    // Calculate column widths
    //set the column width to the maximum length of the values
    const colWidths = columns.map((col) =>
      Math.max(
        col.length,
        ...this.students.map((s) => formatValue(s[col]).length)
      )
    );

    // Table helpers
    // row to create the proper table format
    const line = '+' + colWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+';

    //header row
    const headerRow =
      '| ' + columns.map((c, i) => c.padEnd(colWidths[i])).join(' | ') + ' |';

    //each data line
    const rows = this.students.map(
      (s) =>
        '| ' +
        columns
          .map((c, i) => formatValue(s[c]).padEnd(colWidths[i]))
          .join(' | ') +
        ' |'
    );

    //define the table
    const table = [headerRow, line, ...rows].join('\n');

    // Download
    const blob = new Blob([table], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.txt';
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
