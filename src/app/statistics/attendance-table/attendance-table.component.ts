import { DecimalPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuoteByNameDto } from '../../api/openapi';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';

@Component({
  selector: 'hop-attendance-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, LoadingMaskComponent, DecimalPipe, PercentPipe],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.scss'
})
export class AttendanceTableComponent implements OnChanges, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['rank', 'name', 'count', 'quote'];
  dataSource: MatTableDataSource<QuoteByNameDto>;

  @Input() data: QuoteByNameDto[] | null = null;
  @Input() loading: boolean | null = false;

  constructor() {
    this.dataSource = new MatTableDataSource(this.data || []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = changes['data'].currentValue;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

}
