import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienPageComponent } from './mecanicien-page.component';

describe('MecanicienPageComponent', () => {
  let component: MecanicienPageComponent;
  let fixture: ComponentFixture<MecanicienPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecanicienPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
