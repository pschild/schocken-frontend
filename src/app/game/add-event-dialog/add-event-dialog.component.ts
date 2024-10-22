import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { EventTypeDetailDto, EventTypeOverviewDto, PlayerDto } from '../../api/openapi';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { AddEventFormComponent, AddEventModel } from './add-event-form/add-event-form.component';
import TriggerEnum = EventTypeDetailDto.TriggerEnum;

@Component({
  selector: 'hop-add-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    PenaltyWithUnitComponent,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    AddEventFormComponent,
    MatSelect,
    MatOption,
    FormsModule,
    MatDivider
  ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEventDialogComponent>);
  data: { player: PlayerDto; eventTypes: EventTypeOverviewDto[] } = inject(MAT_DIALOG_DATA);

  favoriteEventTypes: EventTypeOverviewDto[] = [];
  otherEventTypes: EventTypeOverviewDto[] = [];

  selectedEventType: EventTypeOverviewDto | null = null;

  ngOnInit(): void {
    const schockAusPenaltyEventType = this.data.eventTypes.find(eventType => eventType.trigger === TriggerEnum.SchockAusPenalty);
    const cleanedEventTypes = this.data.eventTypes.filter(eventType => ![schockAusPenaltyEventType?.id].includes(eventType.id));
    this.favoriteEventTypes = cleanedEventTypes.slice(0, 3);
    this.otherEventTypes = [
      ...cleanedEventTypes.slice(3),
      ...(schockAusPenaltyEventType ? [schockAusPenaltyEventType] : []),
    ];
  }

  handleEventAdded(event: AddEventModel): void {
    this.dialogRef.close(event);
  }
}
