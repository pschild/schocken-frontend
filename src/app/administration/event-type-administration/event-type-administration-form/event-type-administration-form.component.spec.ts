import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeAdministrationFormComponent } from './event-type-administration-form.component';

describe('EventTypeAdministrationFormComponent', () => {
  let component: EventTypeAdministrationFormComponent;
  let fixture: ComponentFixture<EventTypeAdministrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeAdministrationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeAdministrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
