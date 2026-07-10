import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaExterna } from './consulta-externa';

describe('ConsultaExterna', () => {
  let component: ConsultaExterna;
  let fixture: ComponentFixture<ConsultaExterna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaExterna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaExterna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
