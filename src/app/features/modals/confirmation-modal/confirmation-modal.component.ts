import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationModalConfig {
  icon?: string;
  title: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss', '../../../../assets/styles/styles-seleccion.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationModalConfig
  ) {
    // Set default values if not provided
    this.data = {
      icon: data.icon || 'warning',
      title: data.title || '',
      message: data.message || '',
      subMessage: data.subMessage,
      confirmText: data.confirmText || 'Confirmar',
      cancelText: data.cancelText || 'Cancelar',
      confirmButtonClass: data.confirmButtonClass || 'btn-primary'
    };
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
