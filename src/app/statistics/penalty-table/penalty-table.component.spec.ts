import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyTableComponent } from './penalty-table.component';

describe('PenaltyTableComponent', () => {
  let component: PenaltyTableComponent;
  let fixture: ComponentFixture<PenaltyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
