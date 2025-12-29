import { Component, Inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogData } from '../../../constants/dialogData.model';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onDefaultAdd() {
    this.dialogRef.close(1);
  }

  onCustomizedAdd() {
    this.dialogRef.close(2);
  }
}
