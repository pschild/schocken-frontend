import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CreateGameDto, GameDetailDto, PlayerDto } from '../../api/openapi';
import { PlaceTypeToLabelPipe } from '../../shared/pipes/place-type-to-label.pipe';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;

@Component({
  selector: 'hop-game-details-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    PlaceTypeToLabelPipe,
    MatHint,
    MatSlideToggle,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './game-details-form.component.html',
  styleUrl: './game-details-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailsFormComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  readonly dialogRef = inject(MatDialogRef<GameDetailsFormComponent>);
  data: { gameDetails?: GameDetailDto; activePlayers: PlayerDto[] } = inject(MAT_DIALOG_DATA);

  title: string = 'Neues Spiel';
  confirmButtonLabel: string = 'Weiter';

  PlaceType = CreateGameDto.PlaceTypeEnum;
  placeTypes: string[] = Object.values(CreateGameDto.PlaceTypeEnum);

  form = new FormGroup({
    type: new FormControl<PlaceTypeEnum | null>(null, Validators.required),
    hostedById: new FormControl<string | null>(null),
    placeOfAwayGame: new FormControl<string | null>(null),
    excludeFromStatistics: new FormControl<boolean>(false),
  });

  ngOnInit() {
    if (this.data.gameDetails) {
      this.title = 'Spiel bearbeiten';
      this.confirmButtonLabel = 'Speichern';
      this.form.setValue({
        type: this.data.gameDetails.place.type,
        hostedById: this.data.gameDetails.place.hostedById || null,
        placeOfAwayGame: this.data.gameDetails.place.type === PlaceTypeEnum.Away ? this.data.gameDetails.place.locationLabel || null : null,
        excludeFromStatistics: this.data.gameDetails.excludeFromStatistics
      });
    }

    this.form.controls.type.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(type => {
      const hostedByIdControl = this.form.controls.hostedById;
      const placeOfAwayGameControl = this.form.controls.placeOfAwayGame;
      if (type === PlaceTypeEnum.Home) {
        hostedByIdControl.setValidators(Validators.required);

        placeOfAwayGameControl.clearValidators();
        placeOfAwayGameControl.reset();
      } else if (type === PlaceTypeEnum.Away) {
        placeOfAwayGameControl.setValidators(Validators.required);

        hostedByIdControl.clearValidators();
        hostedByIdControl.reset();
      } else {
        hostedByIdControl.clearValidators();
        hostedByIdControl.reset();

        placeOfAwayGameControl.clearValidators();
        placeOfAwayGameControl.reset();
      }
      hostedByIdControl.updateValueAndValidity();
      placeOfAwayGameControl.updateValueAndValidity();
    });
  }

  save(): void {
    this.dialogRef.close({
      type: this.form.value.type,
      hostedById: this.form.value.hostedById,
      placeOfAwayGame: this.form.value.placeOfAwayGame,
      excludeFromStatistics: this.form.value.excludeFromStatistics,
    });
  }

}