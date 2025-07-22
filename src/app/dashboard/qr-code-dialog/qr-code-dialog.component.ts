import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { UserPaymentDto } from '../../api/openapi';
import PenaltyUnitEnum = UserPaymentDto.PenaltyUnitEnum;

@Component({
  selector: 'hop-qr-code-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    PenaltyWithUnitComponent
  ],
  templateUrl: './qr-code-dialog.component.html',
  styleUrl: './qr-code-dialog.component.scss'
})
export class QrCodeDialogComponent {
  data: { qrCode: string; penalty: { value: number; unit: PenaltyUnitEnum }; } = inject(MAT_DIALOG_DATA);
}
