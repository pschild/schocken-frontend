import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalsAttendanceTableComponent } from './finals-attendance-table.component';

describe('FinalsAttendanceTableComponent', () => {
  let component: FinalsAttendanceTableComponent;
  let fixture: ComponentFixture<FinalsAttendanceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalsAttendanceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalsAttendanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
