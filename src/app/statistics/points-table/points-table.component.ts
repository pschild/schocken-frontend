import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, computed,
  effect,
  inject,
  input,
  viewChild
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PointsDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { RankComponent } from '../rank/rank.component';

@Component({
  selector: 'hop-points-table',
  standalone: true,
  imports: [
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    RankComponent,
    CurrentUserDirective,
    DecimalPipe,
  ],
  templateUrl: './points-table.component.html',
  styleUrl: './points-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<PointsDto[], PointsDto[] | null>([], {
    transform: (value: PointsDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  isExpanded = input<boolean>(false);

  displayedColumns = computed<string[]>(() => this.isExpanded()
    ? ['rank', 'name', 'roundPoints', 'bonusPoints', 'penaltyPoints', 'gamePoints', 'points']
    : ['rank', 'name', 'points']
  );

  dataSource: MatTableDataSource<PointsDto> = new MatTableDataSource();

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
