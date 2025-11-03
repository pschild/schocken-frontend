import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { filter, Observable } from 'rxjs';
import { StreakStatisticsResponseDto } from '../../api/openapi';
import { StreakChartComponent } from '../streak-chart/streak-chart.component';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { RankComponent } from '../rank/rank.component';
import { CurrentUserDirective } from '../../shared/current-user.directive';

@Component({
  selector: 'hop-streaks',
  imports: [
    StreakChartComponent,
    MatButtonToggleModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    LoadingMaskComponent,
    RankComponent,
    CurrentUserDirective
  ],
  templateUrl: './streaks.component.html',
  styleUrl: './streaks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreaksComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  filterForm = new FormGroup({
    type: new FormControl<string>('with'),
    eventTypeId: new FormControl<string>(''),
  });

  data = input<StreakStatisticsResponseDto | null>(null);
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  eventTypeOptions = computed(() => {
    if (this.data()) {
      const eventTypes = this.data()!.eventTypeStreaks.map(streak => ({id: streak.eventTypeId, description: streak.description}));
      return [...eventTypes, {id: 'penalty', description: 'Strafe'}, {id: 'attendance', description: 'Teilnahme'}];
    }
    return [];
  });

  formValue = toSignal(this.filterForm.valueChanges, {initialValue: null});

  visibleStreaks = computed(() => {
    const formValue = this.formValue();
    const input = this.data();

    if (!formValue || !input) {
      return null;
    }

    if (formValue.eventTypeId === 'penalty') {
      return formValue.type === 'with'
        ? input.penaltyStreaks
        : input.noPenaltyStreaks;
    } else if (formValue.eventTypeId === 'attendance') {
      return formValue.type === 'with'
        ? this.data()?.attendanceStreaks
        : [];
    } else {
      return formValue.type === 'with'
        ? input.eventTypeStreaks.find(s => s.eventTypeId === formValue.eventTypeId)?.streaks
        : input.noEventTypeStreaks.find(s => s.eventTypeId === formValue.eventTypeId)?.streaks;
    }
  });

  // Workaround, as reactive forms and signals don't play well together yet...
  options$: Observable<{ id: string; description: string }[]> = toObservable(this.eventTypeOptions);

  ngOnInit(): void {
    this.options$.pipe(
      filter(options => options.length > 0),
      filter(() => !this.filterForm.value.eventTypeId),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(options => {
      this.filterForm.patchValue({
        eventTypeId: options[0].id
      });
    });
  }

}
