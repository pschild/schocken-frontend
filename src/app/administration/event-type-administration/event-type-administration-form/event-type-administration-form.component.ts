import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EventTypeDto } from '../../../api/openapi';
import { undefinedToNull } from '../../../dialog/dialog.utils';
import { PenaltyWithUnitComponent } from '../../../shared/penalty-with-unit/penalty-with-unit.component';
import { ContextToLabelPipe } from '../../../shared/pipes/context-to-label.pipe';
import { TriggerToLabelPipe } from '../../../shared/pipes/trigger-to-label.pipe';
import ContextEnum = EventTypeDto.ContextEnum;
import PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;
import TriggerEnum = EventTypeDto.TriggerEnum;

@Component({
  selector: 'hop-event-type-administration-form',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatLabel, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatRadioGroup, MatRadioButton, MatCheckbox, MatSelect, MatOption, MatIcon, MatDivider, MatExpansionModule, PenaltyWithUnitComponent, TriggerToLabelPipe, ContextToLabelPipe],
  templateUrl: './event-type-administration-form.component.html',
  styleUrl: './event-type-administration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypeAdministrationFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EventTypeAdministrationFormComponent>);
  data: { eventType?: EventTypeDto } = inject(MAT_DIALOG_DATA);
  destroyRef = inject(DestroyRef);

  ContextEnum = EventTypeDto.ContextEnum;
  PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;
  eventTypeTriggers: string[] = Object.values(EventTypeDto.TriggerEnum);

  title: string = 'Neues Ereignis';

  form = new FormGroup({
    description: new FormControl<string | null>(null, Validators.required),
    context: new FormControl<ContextEnum>(ContextEnum.Round, Validators.required),
    hasComment: new FormControl<boolean>(false),
    hasPenalty: new FormControl<boolean>(false),
    penaltyValue: new FormControl<number | null>(null),
    penaltyUnit: new FormControl<PenaltyUnitEnum | null>(null),
    multiplicatorUnit: new FormControl<string | null>(null),
    trigger: new FormControl<TriggerEnum | null>(null),
  });

  ngOnInit(): void {
    if (this.data.eventType) {
      this.title = 'Ereignis bearbeiten';
      this.form.patchValue(this.data.eventType);
      this.form.controls.hasPenalty.patchValue(typeof this.data.eventType.penaltyValue !== 'undefined' && !!this.data.eventType.penaltyUnit);
    }

    this.form.controls.hasPenalty.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(checked => {
      const penaltyValueControl = this.form.controls.penaltyValue;
      const penaltyUnitControl = this.form.controls.penaltyUnit;
      const multiplicatorUnitControl = this.form.controls.multiplicatorUnit;
      if (checked) {
        penaltyValueControl.setValidators([Validators.required, Validators.min(0)]);
        penaltyUnitControl.setValidators(Validators.required);
      } else {
        penaltyValueControl.clearValidators();
        penaltyUnitControl.clearValidators();

        penaltyValueControl.reset();
        penaltyUnitControl.reset();
        multiplicatorUnitControl.reset();
      }
      penaltyValueControl.updateValueAndValidity();
      penaltyUnitControl.updateValueAndValidity();
    });
  }

  save(): void {
    this.dialogRef.close(undefinedToNull(this.form.value));
  }

}
