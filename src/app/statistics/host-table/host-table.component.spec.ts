import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostTableComponent } from './host-table.component';

describe('HostTableComponent', () => {
  let component: HostTableComponent;
  let fixture: ComponentFixture<HostTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
