import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PlayerDto } from '../../../api/openapi';
import { undefinedToNull } from '../../../dialog/dialog.utils';

@Component({
  selector: 'hop-player-administration-form',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatLabel, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  templateUrl: './player-administration-form.component.html',
  styleUrl: './player-administration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAdministrationFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PlayerAdministrationFormComponent>);
  data: { player?: PlayerDto } = inject(MAT_DIALOG_DATA);

  title: string = 'Neuer Spieler';

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    active: new FormControl<boolean>(true),
  });

  ngOnInit(): void {
    if (this.data.player) {
      this.title = 'Spieler bearbeiten';
      this.form.patchValue(this.data.player);
    }
  }

  save(): void {
    this.dialogRef.close(undefinedToNull(this.form.value));
  }
}
