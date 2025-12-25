// src/app/shared/pipes/currency-format.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | string, currency: string = 'CLP'): string {
    if (value === null || value === undefined) return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency
    }).format(numValue);
  }
}
