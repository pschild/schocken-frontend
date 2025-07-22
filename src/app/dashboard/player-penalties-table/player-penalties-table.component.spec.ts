import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPenaltiesTableComponent } from './player-penalties-table.component';

describe('PlayerPenaltiesTableComponent', () => {
  let component: PlayerPenaltiesTableComponent;
  let fixture: ComponentFixture<PlayerPenaltiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerPenaltiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerPenaltiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
