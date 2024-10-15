import { ChangeDetectionStrategy, Component, effect, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EventTypeOverviewDto } from '../../../api/openapi';
import { PenaltyWithUnitComponent } from '../../../shared/penalty-with-unit/penalty-with-unit.component';

export interface AddEventModel {
  id: string;
  comment?: string;
  multiplicatorValue?: number;
}

@Component({
  selector: 'hop-add-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    PenaltyWithUnitComponent,
  ],
  templateUrl: './add-event-form.component.html',
  styleUrl: './add-event-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventFormComponent {

  eventType = input.required<EventTypeOverviewDto>();

  onAddEvent = output<AddEventModel>();

  form = new FormGroup({
    id: new FormControl<string>('', {nonNullable: true}),
    comment: new FormControl<string | null>(null),
    multiplicatorValue: new FormControl<number>(1, Validators.min(1)),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({ id: this.eventType().id });
    });
  }

  saveEvent(): void {
    this.onAddEvent.emit({
      id: this.form.value.id!,
      ...(this.form.value.multiplicatorValue ? { multiplicatorValue: this.form.value.multiplicatorValue } : {}),
      ...(this.form.value.comment ? { comment: this.form.value.comment } : {}),
    });
  }
}