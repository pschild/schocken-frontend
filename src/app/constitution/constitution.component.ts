import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'hop-constitution',
  imports: [
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './constitution.component.html',
  styleUrl: './constitution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstitutionComponent {

}
