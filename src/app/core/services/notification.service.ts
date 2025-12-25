// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private toastr: ToastrService) {}

  success(message: string, duration: number = 3000): void {
    this.toastr.success(message, 'Éxito', { timeOut: duration });
  }

  error(message: string, duration: number = 5000): void {
    this.toastr.error(message, 'Error', { timeOut: duration });
  }

  warning(message: string, duration: number = 4000): void {
    this.toastr.warning(message, 'Advertencia', { timeOut: duration });
  }

  info(message: string, duration: number = 3000): void {
    this.toastr.info(message, 'Información', { timeOut: duration });
  }
}
