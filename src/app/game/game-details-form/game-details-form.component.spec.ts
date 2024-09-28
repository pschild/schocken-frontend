import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailsFormComponent } from './game-details-form.component';

describe('GameDetailsFormComponent', () => {
  let component: GameDetailsFormComponent;
  let fixture: ComponentFixture<GameDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
