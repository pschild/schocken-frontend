import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from './permissions.service';

@Directive({
  standalone: true,
  selector: '[hopHasAllPermissions]',
})
export class HasAllPermissionsDirective {

  private permissions: string[] = [];

  private permissionService = inject(PermissionsService);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {
  }

  @Input()
  set hopHasAllPermissions(permissions: string[]) {
    this.permissions = permissions;
    this.updateView();
  }

  private updateView(): void {
    this.permissionService.hasAllPermissions(this.permissions).subscribe(hasAllPermissions => {
      if (hasAllPermissions) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

}
