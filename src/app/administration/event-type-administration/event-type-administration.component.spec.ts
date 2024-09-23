import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeAdministrationComponent } from './event-type-administration.component';

describe('EventTypeAdministrationComponent', () => {
  let component: EventTypeAdministrationComponent;
  let fixture: ComponentFixture<EventTypeAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
