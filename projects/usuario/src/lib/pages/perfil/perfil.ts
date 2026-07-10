import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core'
import { AuthService, Info } from 'auth'
import { CardModule } from 'primeng/card'
import { MessageModule } from 'primeng/message'
import { TabsModule } from 'primeng/tabs'

import { TarjetaAsistencia } from '../../components/tarjeta-asistencia/tarjeta-asistencia'
import { Persona } from '../../models/persona'
import { DatosEmpleo } from '../../models/usuario'
import { RrhhEmpledoService } from '../../services/rrhh-empleado.service'
import { RrhhPersonaService } from '../../services/rrhh-persona.service'

@Component({
  selector: 'lib-perfil',
  imports: [CommonModule, CardModule, TabsModule, MessageModule, TarjetaAsistencia],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  user: Info | undefined
  persona = signal<Persona | null>(null)
  ci = signal<string>('')
  personaId = signal<number>(0)
  imageToShow = signal<string | null>(null)
  isImageLoading!: boolean

  dataEmpleo = signal<DatosEmpleo | null>(null)
  estado = 'ACTIVO'
  empleadoId = signal<number>(0)
  reloadTarjeta = 0

  private authService = inject(AuthService)
  private cdr = inject(ChangeDetectorRef)
  private rrhhPersonaService = inject(RrhhPersonaService)
  private rrhhEmpledoService = inject(RrhhEmpledoService)

  ngOnInit(): void {
    this.user = this.authService.identityClaims
    if (this.user.document && this.user.birthdate) {
      this.rrhhPersonaService
        .getPersona(this.user.document, this.user.birthdate)
        .subscribe(data => {
          this.persona.set(data)
          this.ci.set(data.numeroDocumento)
          this.personaId.set(data.id)
          this.empleadoId.set(data.empleadoId)
          this.getEmpleado(data.empleadoId)
          this.getImagen()
          this.cdr.markForCheck()
        })
    }
  }

  getImagen() {
    this.isImageLoading = true
    const imagenId = this.persona()?.imagenId
    if (imagenId) {
      this.rrhhPersonaService.getFotoProfile(imagenId).subscribe({
        next: dataimage => {
          this.createImageFromBlob(dataimage)
          this.isImageLoading = false
        },
        error: () => {
          this.isImageLoading = false
        },
      })
    }
  }

  createImageFromBlob(image: Blob) {
    const objectURL = URL.createObjectURL(image)
    this.imageToShow.set(objectURL)
  }

  getEmpleado(empleadoId: number) {
    this.rrhhEmpledoService.getDatosEmpleo(empleadoId).subscribe(dataEmpleo => {
      this.dataEmpleo.set(dataEmpleo)
      this.estado = dataEmpleo.estado == 'A' ? 'Activo' : 'Inactivo'
    })
  }

  onTabChange(value: string | number | undefined): void {
    if (String(value) === '1') {
      this.reloadTarjeta++
    }
  }
}
