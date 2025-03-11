import { ChangeDetectionStrategy, Component, effect, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EventTypeOverviewDto } from '../../../api/openapi';
import { CelebrationDirective } from '../../../shared/celebration.directive';
import { PenaltyWithUnitComponent } from '../../../shared/penalty-with-unit/penalty-with-unit.component';
import TriggerEnum = EventTypeOverviewDto.TriggerEnum;

export interface AddEventModel {
  id: string;
  comment?: string;
  multiplicatorValue?: number;
  trigger?: TriggerEnum;
}

@Component({
  selector: 'hop-add-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    PenaltyWithUnitComponent,
    CelebrationDirective,
  ],
  templateUrl: './add-event-form.component.html',
  styleUrl: './add-event-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventFormComponent {

  TriggerEnum = TriggerEnum;

  eventType = input.required<EventTypeOverviewDto>();

  onAddEvent = output<AddEventModel>();

  form = new FormGroup({
    id: new FormControl<string>('', {nonNullable: true}),
    comment: new FormControl<string | null>(null),
    multiplicatorValue: new FormControl<number>(1, Validators.min(0)),
  });

  constructor() {
    effect(() => {
      this.form.reset({ id: this.eventType().id });
    });
  }

  saveEvent(): void {
    this.onAddEvent.emit({
      id: this.form.value.id!,
      ...(this.form.value.multiplicatorValue ? { multiplicatorValue: this.form.value.multiplicatorValue } : {}),
      ...(this.form.value.comment ? { comment: this.form.value.comment } : {}),
      trigger: this.eventType().trigger,
    });
  }
}
