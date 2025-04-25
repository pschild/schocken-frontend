import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivePointsTableComponent } from './live-points-table.component';

describe('LivePointsTableComponent', () => {
  let component: LivePointsTableComponent;
  let fixture: ComponentFixture<LivePointsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivePointsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivePointsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
