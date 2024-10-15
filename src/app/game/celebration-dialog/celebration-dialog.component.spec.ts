import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationDialogComponent } from './celebration-dialog.component';

describe('CelebrationDialogComponent', () => {
  let component: CelebrationDialogComponent;
  let fixture: ComponentFixture<CelebrationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelebrationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelebrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
