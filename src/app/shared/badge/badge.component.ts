import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeType } from './badge-type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'hop-badge',
  imports: [
    NgClass
  ],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {

  type = input<BadgeType>();

  getClassNameByType(): string | null {
    switch (this.type()) {
      case BadgeType.SUCCESS:
        return 'success';
      case BadgeType.WARN:
        return 'warn';
      case BadgeType.ERROR:
        return 'error';
      case BadgeType.ERROR_ALT:
        return 'error-alt';
      default:
        return null;
    }
  }

}
