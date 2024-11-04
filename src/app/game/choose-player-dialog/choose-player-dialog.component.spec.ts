import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePlayerDialogComponent } from './choose-player-dialog.component';

describe('ChoosePlayerDialogComponent', () => {
  let component: ChoosePlayerDialogComponent;
  let fixture: ComponentFixture<ChoosePlayerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePlayerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosePlayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
