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
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { PlayerDto } from '../../api/openapi';
import { InfoBoxComponent } from '../../shared/info-box/info-box.component';

@Component({
  selector: 'hop-choose-player-dialog',
  imports: [
    MatSelectionList,
    MatListOption,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    InfoBoxComponent
  ],
  templateUrl: './choose-player-dialog.component.html',
  styleUrl: './choose-player-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoosePlayerDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ChoosePlayerDialogComponent>);
  data: { title: string; showHint?: boolean; players: PlayerDto[]; selectedIds: string[]; disabledIds: string[] } = inject(MAT_DIALOG_DATA);

  selectedOptions: string[] = [];

  ngOnInit() {
    this.selectedOptions = this.data.selectedIds;
  }

  save(): void {
    this.dialogRef.close(this.selectedOptions);
  }
}
