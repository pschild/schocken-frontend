import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
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
import { MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PlayerDto, UserDto } from '../../../api/openapi';
import { HasRoleDirective } from '../../../auth/has-role.directive';
import { Role } from '../../../auth/model/role.enum';
import { undefinedToNull } from '../../../dialog/dialog.utils';

@Component({
  selector: 'hop-player-administration-form',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatLabel, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatOption, MatSelect, HasRoleDirective],
  templateUrl: './player-administration-form.component.html',
  styleUrl: './player-administration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerAdministrationFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PlayerAdministrationFormComponent>);
  data: { player?: PlayerDto, users: UserDto[] } = inject(MAT_DIALOG_DATA);

  Role = Role;

  title: string = 'Neuer Spieler';

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    active: new FormControl<boolean>(true),
    auth0UserId: new FormControl<string | null>(null),
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
