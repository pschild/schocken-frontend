import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Directive({
  standalone: true,
  selector: 'button [hopResponsiveButton]',
})
export class ResponsiveButtonDirective implements OnInit {

  readonly breakpointObserver = inject(BreakpointObserver);

  private el = inject(ElementRef);

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
    map(state => state.matches)
  );

  ngOnInit(): void {
    this.isMobile$.subscribe(isMobile => {
      if (isMobile) {
        this.el.nativeElement.classList.add('mobile-button');
      } else {
        this.el.nativeElement.classList.remove('mobile-button');
      }
    });
  }

}
