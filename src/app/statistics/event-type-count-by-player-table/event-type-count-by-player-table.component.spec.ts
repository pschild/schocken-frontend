import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeCountByPlayerTableComponent } from './event-type-count-by-player-table.component';

describe('EventTypeCountByPlayerTableComponent', () => {
  let component: EventTypeCountByPlayerTableComponent;
  let fixture: ComponentFixture<EventTypeCountByPlayerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeCountByPlayerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeCountByPlayerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
