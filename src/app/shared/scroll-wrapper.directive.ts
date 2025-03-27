import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'table [hopScrollWrapper]',
})
export class ScrollWrapperDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'overflow-x', 'auto');
    this.renderer.setStyle(wrapper, 'overflow-y', 'hidden');

    const el = this.elementRef.nativeElement;
    const parent = el.parentNode;

    this.renderer.insertBefore(parent, wrapper, el);
    this.renderer.appendChild(wrapper, el);
  }
}
