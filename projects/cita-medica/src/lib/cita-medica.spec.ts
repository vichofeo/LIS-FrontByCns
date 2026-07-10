import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CitaMedica } from './cita-medica'

describe('CitaMedica', () => {
  let component: CitaMedica
  let fixture: ComponentFixture<CitaMedica>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaMedica],
    }).compileComponents()

    fixture = TestBed.createComponent(CitaMedica)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
