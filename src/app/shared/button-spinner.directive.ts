import { ComponentRef, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  standalone: true,
  selector: 'button',
})
export class ButtonSpinnerDirective implements OnChanges {

  private spinner!: ComponentRef<MatProgressSpinner> | null;

  @Input() loading = false;
  @Input() disabled = false;

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['loading']) {
      return;
    }

    if (changes['loading'].currentValue) {
      this.el.nativeElement.classList.add('button-loading');
      this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
      this.createSpinner();
    } else if (!changes['loading'].firstChange) {
      this.el.nativeElement.classList.remove('button-loading');
      this.renderer.setProperty(this.el.nativeElement, 'disabled', this.disabled);
      this.destroySpinner();
    }
  }

  private createSpinner(): void {
    if (!this.spinner) {
      this.spinner = this.viewContainerRef.createComponent(MatProgressSpinner);
      this.spinner.instance.diameter = 20;
      this.spinner.instance.mode = 'indeterminate';
      this.renderer.appendChild(
        this.el.nativeElement,
        this.spinner.instance._elementRef.nativeElement
      );
    }
  }

  private destroySpinner(): void {
    if (this.spinner) {
      this.spinner.destroy();
      this.spinner = null;
    }
  }

}
