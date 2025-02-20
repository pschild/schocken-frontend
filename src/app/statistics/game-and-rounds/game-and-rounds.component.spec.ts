import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAndRoundsComponent } from './game-and-rounds.component';

describe('GameAndRoundsComponent', () => {
  let component: GameAndRoundsComponent;
  let fixture: ComponentFixture<GameAndRoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAndRoundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameAndRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
