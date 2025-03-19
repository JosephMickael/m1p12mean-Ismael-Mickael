import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilClientComponent } from './acceuil-client.component';

describe('AcceuilClientComponent', () => {
  let component: AcceuilClientComponent;
  let fixture: ComponentFixture<AcceuilClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
