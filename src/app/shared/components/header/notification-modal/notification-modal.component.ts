import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss', '../../../../../assets/styles/styles-seleccion.scss'],
  imports: [CommonModule]
})
export class NotificationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}