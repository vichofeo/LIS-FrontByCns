import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Vigencia } from './vigencia'

describe('Vigencia', () => {
  let component: Vigencia
  let fixture: ComponentFixture<Vigencia>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vigencia],
    }).compileComponents()

    fixture = TestBed.createComponent(Vigencia)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
