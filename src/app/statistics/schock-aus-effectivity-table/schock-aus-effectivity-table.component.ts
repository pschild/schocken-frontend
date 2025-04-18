import { DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SchockAusEffectivityTableDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { HintComponent } from '../../shared/hint/hint.component';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';
import { RankComponent } from '../rank/rank.component';

@Component({
  selector: 'hop-schock-aus-effectivity-table',
  imports: [
    DecimalPipe,
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    RankComponent,
    ScrollWrapperDirective,
    CurrentUserDirective,
    HintComponent
  ],
  templateUrl: './schock-aus-effectivity-table.component.html',
  styleUrl: './schock-aus-effectivity-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchockAusEffectivityTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<SchockAusEffectivityTableDto[], SchockAusEffectivityTableDto[] | null>([], {
    transform: (value: SchockAusEffectivityTableDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['rank', 'name', 'saCount', 'sasCount', 'quote'];
  dataSource: MatTableDataSource<SchockAusEffectivityTableDto> = new MatTableDataSource();

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
