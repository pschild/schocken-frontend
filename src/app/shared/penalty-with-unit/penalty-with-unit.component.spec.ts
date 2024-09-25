import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyWithUnitComponent } from './penalty-with-unit.component';

describe('PenaltyWithUnitComponent', () => {
  let component: PenaltyWithUnitComponent;
  let fixture: ComponentFixture<PenaltyWithUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyWithUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyWithUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
