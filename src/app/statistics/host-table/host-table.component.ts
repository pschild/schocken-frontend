import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HostsTableDto } from '../../api/openapi';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { PlaceTypeToLabelPipe } from '../../shared/pipes/place-type-to-label.pipe';

@Component({
  selector: 'hop-host-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, LoadingMaskComponent, PlaceTypeToLabelPipe],
  templateUrl: './host-table.component.html',
  styleUrl: './host-table.component.scss'
})
export class HostTableComponent implements OnChanges, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['rank', 'placeType', 'name', 'count'];
  dataSource: MatTableDataSource<HostsTableDto>;

  @Input() data: HostsTableDto[] | null = null;
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
