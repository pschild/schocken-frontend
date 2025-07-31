import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[hopAutoPlacement]'
})
export class AutoPlacementDirective implements OnChanges {

  @Input() hopAutoPlacement!: number;

  constructor(
    private elRef: ElementRef<HTMLElement>,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const barWidth = this.elRef.nativeElement.parentElement?.offsetWidth ?? 0;
    const labelWidth = (this.elRef.nativeElement.firstElementChild as HTMLElement).offsetWidth;
    if (labelWidth >= barWidth) {
      this.elRef.nativeElement.classList.add('outer');
    } else {
      this.elRef.nativeElement.classList.remove('outer');
    }
  }

}
