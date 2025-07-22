import { Directive, ElementRef, input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'table [hopScrollWrapper]',
})
export class ScrollWrapperDirective implements OnInit {

  hopScrollWrapperHeight = input();
  hopScrollWrapperMaxHeight = input();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const height = this.hopScrollWrapperHeight()
      ? `${this.hopScrollWrapperHeight()}px`
      : undefined;
    const maxHeight = this.hopScrollWrapperMaxHeight()
      ? `${this.hopScrollWrapperMaxHeight()}px`
      : undefined;

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'overflow-x', 'auto');
    this.renderer.setStyle(wrapper, 'overflow-y', height || maxHeight ? 'auto' : 'hidden');
    if (height) {
      this.renderer.setStyle(wrapper, 'height', height);
    }
    if (maxHeight) {
      this.renderer.setStyle(wrapper, 'max-height', maxHeight);
    }

    const el = this.elementRef.nativeElement;
    const parent = el.parentNode;

    this.renderer.insertBefore(parent, wrapper, el);
    this.renderer.appendChild(wrapper, el);
  }
}
