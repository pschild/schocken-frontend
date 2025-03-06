import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from './permissions.service';

@Directive({
  standalone: true,
  selector: '[hopHasPermission]',
})
export class HasPermissionDirective {

  private permission: string | undefined;

  private permissionService = inject(PermissionsService);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {
  }

  @Input()
  set hopHasPermission(permission: string | undefined) {
    this.permission = permission;
    this.updateView();
  }

  private updateView(): void {
    if (!this.permission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    this.permissionService.hasPermission(this.permission).subscribe(hasPermission => {
      if (hasPermission) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

}
