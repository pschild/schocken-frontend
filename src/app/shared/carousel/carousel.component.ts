import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'hop-carousel',
  imports: [
    NgTemplateOutlet,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {

  @ContentChildren('carouselItem') templateRefs!: QueryList<TemplateRef<Element>>;

  currentIndex = 0;

}
