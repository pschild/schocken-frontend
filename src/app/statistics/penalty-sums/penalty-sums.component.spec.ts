import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltySumsComponent } from './penalty-sums.component';

describe('PenaltySumsComponent', () => {
  let component: PenaltySumsComponent;
  let fixture: ComponentFixture<PenaltySumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltySumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltySumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
