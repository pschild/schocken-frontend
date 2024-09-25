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
import { PenaltyWithUnitComponent } from '../../../shared/penalty-with-unit/penalty-with-unit.component';
import ContextEnum = EventTypeDto.ContextEnum;
import PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;

@Component({
  selector: 'hop-event-type-administration-form',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatLabel, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatRadioGroup, MatRadioButton, MatCheckbox, MatSelect, MatOption, MatIcon, MatDivider, MatExpansionModule, PenaltyWithUnitComponent],
  templateUrl: './event-type-administration-form.component.html',
  styleUrl: './event-type-administration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypeAdministrationFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EventTypeAdministrationFormComponent>);
  data = inject(MAT_DIALOG_DATA);
  destroyRef = inject(DestroyRef);

  ContextEnum = EventTypeDto.ContextEnum;
  PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;
  eventTypeTriggers: string[] = Object.values(EventTypeDto.TriggerEnum);

  title: string = 'Neues Ereignis';

  form = new FormGroup({
    description: new FormControl(null, Validators.required),
    context: new FormControl(ContextEnum.Round, Validators.required),
    hasComment: new FormControl(false),
    hasPenalty: new FormControl(false),
    penaltyValue: new FormControl(),
    penaltyUnit: new FormControl(PenaltyUnitEnum.Euro),
    multiplicatorUnit: new FormControl(),
    trigger: new FormControl(null),
  });

  ngOnInit(): void {
    if (this.data.eventType) {
      this.title = 'Ereignis bearbeiten';
      this.form.patchValue(this.data.eventType);
      this.form.controls.hasPenalty.patchValue(this.data.eventType.penaltyValue && this.data.eventType.penaltyUnit);
    }

    this.form.controls.hasPenalty.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(checked => {
      const penaltyValueControl = this.form.controls.penaltyValue;
      const penaltyUnitControl = this.form.controls.penaltyUnit;
      const multiplicatorUnitControl = this.form.controls.multiplicatorUnit;
      if (checked) {
        penaltyValueControl.setValidators(Validators.required);
        penaltyUnitControl.setValidators(Validators.required);
      } else {
        penaltyValueControl.clearValidators();
        penaltyUnitControl.clearValidators();

        penaltyValueControl.reset();
        penaltyUnitControl.reset(PenaltyUnitEnum.Euro);
        multiplicatorUnitControl.reset();
      }
      penaltyValueControl.updateValueAndValidity();
      penaltyUnitControl.updateValueAndValidity();
    });
  }

  save(): void {
    this.dialogRef.close(this.form.value);
  }

}