import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementComponent } from './payement.component';

describe('PayementComponent', () => {
  let component: PayementComponent;
  let fixture: ComponentFixture<PayementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
