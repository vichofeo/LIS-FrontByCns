import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Internacion } from './internacion';

describe('Internacion', () => {
  let component: Internacion;
  let fixture: ComponentFixture<Internacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Internacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Internacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
