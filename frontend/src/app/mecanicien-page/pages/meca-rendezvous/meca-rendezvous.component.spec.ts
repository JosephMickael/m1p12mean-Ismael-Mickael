import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecaRendezvousComponent } from './meca-rendezvous.component';

describe('MecaRendezvousComponent', () => {
  let component: MecaRendezvousComponent;
  let fixture: ComponentFixture<MecaRendezvousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecaRendezvousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecaRendezvousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
