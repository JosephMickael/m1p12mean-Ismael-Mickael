import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousManagerComponent } from './rendezvous-manager.component';

describe('RendezvousManagerComponent', () => {
  let component: RendezvousManagerComponent;
  let fixture: ComponentFixture<RendezvousManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendezvousManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendezvousManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
