import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisComponent } from './devis.component';

describe('DevisComponent', () => {
  let component: DevisComponent;
  let fixture: ComponentFixture<DevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
