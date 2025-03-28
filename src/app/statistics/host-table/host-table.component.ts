import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HostsTableDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { HintComponent } from '../../shared/hint/hint.component';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { PlaceTypeToLabelPipe } from '../../shared/pipes/place-type-to-label.pipe';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';

@Component({
  selector: 'hop-host-table',
  imports: [MatTableModule, MatSortModule, LoadingMaskComponent, PlaceTypeToLabelPipe, HintComponent, CurrentUserDirective, ScrollWrapperDirective],
  templateUrl: './host-table.component.html',
  styleUrl: './host-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<HostsTableDto[], HostsTableDto[] | null>([], {
    transform: (value: HostsTableDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['placeType', 'name', 'count'];
  dataSource: MatTableDataSource<HostsTableDto> = new MatTableDataSource();

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }
}
