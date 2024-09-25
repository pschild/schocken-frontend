import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAdministrationFormComponent } from './player-administration-form.component';

describe('PlayerAdministrationFormComponent', () => {
  let component: PlayerAdministrationFormComponent;
  let fixture: ComponentFixture<PlayerAdministrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAdministrationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAdministrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
