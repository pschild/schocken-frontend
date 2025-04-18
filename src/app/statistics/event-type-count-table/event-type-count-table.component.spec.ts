import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeCountTableComponent } from './event-type-count-table.component';

describe('EventTypeCountTableComponent', () => {
  let component: EventTypeCountTableComponent;
  let fixture: ComponentFixture<EventTypeCountTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeCountTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeCountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
