import { Component, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <div class="paginator-wrapper">
      <div class="records-info">{{ getRecordsInfo() }}</div>
      <mat-paginator 
        [length]="dataSource.data.length" 
        [pageSize]="pageSize" 
        [pageSizeOptions]="pageSizeOptions">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .paginator-wrapper {
      position: relative; 
    }

    .records-info {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      font-weight: 500;
      color: #474756;
      font-family: nunito;
      z-index: 1;
    }
  `]
})
export class CustomPaginatorComponent implements AfterViewInit {
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.paginator._intl.itemsPerPageLabel = 'Filas por Página:';
      this.paginator._intl.nextPageLabel = 'Página Siguiente';
      this.paginator._intl.previousPageLabel = 'Página Anterior';

      // Personalizar el formato del rango para mostrar página actual/total de páginas
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0) {
          return `1/1`;
        }
        const totalPages = Math.max(1, Math.ceil(length / pageSize));
        const currentPage = page + 1;
        return `${currentPage}/${totalPages}`;
      };

      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    }
  }

  getRecordsInfo(): string {
    if (!this.paginator || !this.dataSource || this.dataSource.data.length === 0) {
      return '0 de 0';
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min((this.paginator.pageIndex + 1) * this.paginator.pageSize, this.dataSource.data.length);
    return `${startIndex}-${endIndex} de ${this.dataSource.data.length}`;
  }
}
