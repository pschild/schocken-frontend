import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchockAusEffectivityTableComponent } from './schock-aus-effectivity-table.component';

describe('SchockAusEffectivityTableComponent', () => {
  let component: SchockAusEffectivityTableComponent;
  let fixture: ComponentFixture<SchockAusEffectivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchockAusEffectivityTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchockAusEffectivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
