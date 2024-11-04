import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleVerlorenEventDialogComponent } from './handle-verloren-event-dialog.component';

describe('HandleVerlorenEventDialogComponent', () => {
  let component: HandleVerlorenEventDialogComponent;
  let fixture: ComponentFixture<HandleVerlorenEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleVerlorenEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleVerlorenEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
