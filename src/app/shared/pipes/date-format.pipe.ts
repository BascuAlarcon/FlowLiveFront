// src/app/shared/pipes/date-format.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, formatStr: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';
    
    try {
      const date = typeof value === 'string' ? parseISO(value) : value;
      return format(date, formatStr, { locale: es });
    } catch {
      return '';
    }
  }
}
