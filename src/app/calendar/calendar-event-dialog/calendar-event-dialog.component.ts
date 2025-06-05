import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { addHours } from 'date-fns/addHours';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { CreateGameDto, PlayerDto, PlayerService } from '../../api/openapi';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlaceTypeToLabelPipe } from '../../shared/pipes/place-type-to-label.pipe';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;

@Component({
  selector: 'hop-calendar-event-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    JsonPipe,
    MatCheckbox,
    MatOption,
    MatSelect,
    AsyncPipe,
    PlaceTypeToLabelPipe,
  ],
  templateUrl: './calendar-event-dialog.component.html',
  styleUrl: './calendar-event-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarEventDialogComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<CalendarEventDialogComponent>);
  data: { startDate: Date | null; endDate: Date | null; isAllDay: boolean; event: { title: string; props: any } | null } = inject(MAT_DIALOG_DATA);

  title: string = 'Neuer Termin';

  private playerService = inject(PlayerService);

  activePlayers$: Observable<PlayerDto[]>;

  PlaceType = CreateGameDto.PlaceTypeEnum;
  placeTypes: string[] = Object.values(CreateGameDto.PlaceTypeEnum);

  eventForm = new FormGroup({
    type: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    placeType: new FormControl<PlaceTypeEnum | null>({ value: null, disabled: true }, Validators.required),
    hostedById: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    placeOfAwayGame: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    isAllDay: new FormControl<boolean>(false),
    fromDate: new FormControl<Date | null>(null, Validators.required),
    fromTime: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null, Validators.required),
    toTime: new FormControl<Date | null>(null),
  });

  constructor() {
    this.activePlayers$ = this.playerService.findAll().pipe(
      map(players => players.filter(player => player.active && !player.isDeleted))
    );

    this.eventForm.valueChanges.subscribe(value => {
      if (value.type === 'SCHOCKENABEND') {
        this.eventForm.controls.placeType.enable({ emitEvent: false });
        this.eventForm.controls.description.disable({ emitEvent: false });
      } else {
        this.eventForm.controls.placeType.disable({ emitEvent: false });
        this.eventForm.controls.description.enable({ emitEvent: false });
      }

      if (value.placeType === 'HOME') {
        this.eventForm.controls.hostedById.enable({ emitEvent: false });
        this.eventForm.controls.placeOfAwayGame.disable({ emitEvent: false });
      } else if (value.placeType === 'AWAY') {
        this.eventForm.controls.hostedById.disable({ emitEvent: false });
        this.eventForm.controls.placeOfAwayGame.enable({ emitEvent: false });
      } else {
        this.eventForm.controls.hostedById.disable({ emitEvent: false });
        this.eventForm.controls.placeOfAwayGame.disable({ emitEvent: false });
      }
    });

    if (this.data.event) {
      this.title = 'Termin bearbeiten';

      this.eventForm.patchValue({
        type: this.data.event.props.type,
        placeType: this.data.event.props.placeType,
        hostedById: this.data.event.props.hostedById,
        placeOfAwayGame: this.data.event.props.placeOfAwayGame,
        description: 'xxx',
        isAllDay: this.data.isAllDay,
        fromDate: this.data.startDate,
        fromTime: this.data.startDate,
        toDate: this.data.endDate,
        toTime: this.data.endDate,
      });
    } else {
      const fromDate = this.data.startDate || new Date();
      fromDate.setHours(new Date().getHours() + 1, 0, 0);

      const toDate = this.data.endDate || addHours(fromDate, 1);

      this.eventForm.patchValue({
        fromDate,
        fromTime: fromDate,
        toDate,
        toTime: toDate,
      });
    }
  }

  ngOnInit(): void {

  }

  save(): void {
    this.dialogRef.close(true);
  }
}
