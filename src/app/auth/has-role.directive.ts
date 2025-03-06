import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from './permissions.service';

@Directive({
  standalone: true,
  selector: '[hopHasRole]',
})
export class HasRoleDirective {

  private role: string | undefined;

  private permissionService = inject(PermissionsService);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {
  }

  @Input()
  set hopHasRole(role: string | undefined) {
    this.role = role;
    this.updateView();
  }

  private updateView(): void {
    if (!this.role) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    this.permissionService.hasRole(this.role).subscribe(hasRole => {
      if (hasRole) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

}
