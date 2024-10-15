import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { PlayerDto } from '../../api/openapi';
import { InfoBoxComponent } from '../../shared/info-box/info-box.component';

@Component({
  selector: 'hop-edit-attendance-dialog',
  standalone: true,
  imports: [
    MatSelectionList,
    MatListOption,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
    InfoBoxComponent
  ],
  templateUrl: './edit-attendance-dialog.component.html',
  styleUrl: './edit-attendance-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAttendanceDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EditAttendanceDialogComponent>);
  data: { players: PlayerDto[]; selectedIds: string[]; disabledIds: string[] } = inject(MAT_DIALOG_DATA);

  selectedOptions: string[] = [];

  ngOnInit() {
    this.selectedOptions = this.data.selectedIds;
  }

  save(): void {
    this.dialogRef.close(this.selectedOptions);
  }
}
