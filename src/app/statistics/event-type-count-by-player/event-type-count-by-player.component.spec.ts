import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeCountByPlayerComponent } from './event-type-count-by-player.component';

describe('EventTypeCountByPlayerComponent', () => {
  let component: EventTypeCountByPlayerComponent;
  let fixture: ComponentFixture<EventTypeCountByPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeCountByPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeCountByPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
