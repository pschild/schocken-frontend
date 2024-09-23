import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAdministrationComponent } from './player-administration.component';

describe('PlayerAdministrationComponent', () => {
  let component: PlayerAdministrationComponent;
  let fixture: ComponentFixture<PlayerAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
