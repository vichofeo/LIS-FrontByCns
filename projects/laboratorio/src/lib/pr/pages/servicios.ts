import { HttpClient } from '@angular/common/http'
import { Component, OnInit, inject, signal } from '@angular/core'
import { environment } from '@env/environment'
import { AuthService, Info, UserClaims } from 'auth'

import { LabCrud } from '../../shared/components/crud/lab-crud'

interface DatosEmpleo {
  regionalesDescripcion?: string
  oficinasDescripcion?: string
}

interface PersonaRrhh {
  empleadoId?: number
}

type IdentityClaims = Info & UserClaims

@Component({
  selector: 'lab-servicios-page',
  standalone: true,
  imports: [LabCrud],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class Servicios implements OnInit {
  usuario = signal('')
  rol = signal('')
  establecimiento = signal('')
  regional = signal('')

  private authService = inject(AuthService)
  private http = inject(HttpClient)

  private readonly rrhhUrl = environment.production
    ? `${environment.api}/erpcns/${environment.apiVersion}/RecursosHumanos`
    : `${environment.erpCnsApi}/${environment.apiVersion}/RecursosHumanos`

  ngOnInit(): void {
    console.log('[url-api rrhh base]:', this.rrhhUrl)
    console.log('[url-api lis base]:', environment.lisApi)
    const claims = this.authService.identityClaims as IdentityClaims | null
    console.log("clain::", claims)
    const rol = claims?.role

    this.usuario.set(claims?.name || claims?.preferred_username || claims?.username || '')
    this.rol.set(Array.isArray(rol) ? rol.join(', ') : rol || '')

    if (claims?.document && claims?.birthdate) {
      this.cargarDatosEmpleo(claims.document, claims.birthdate)
    }
  }

  private cargarDatosEmpleo(documento: string, fechaNacimiento: string): void {
    const urlPersona = `${this.rrhhUrl}/Personas?DocumentoIdentidad=${documento}&FechaNacimiento=${fechaNacimiento}`
    console.log('[url-api persona]:', urlPersona)
    this.http
      .get<PersonaRrhh>(urlPersona)
      .subscribe({
        next: persona => {
          console.log("[personaData]:", persona)
          if (persona?.empleadoId) {
            this.cargarEmpleo(persona.empleadoId)
          }
        },
      })
  }

  private cargarEmpleo(empleadoId: number): void {
    const urlEmpleado = `${this.rrhhUrl}/Empleados?Id=${empleadoId}`
    console.log('[url-api empleado]:', urlEmpleado)
    this.http.get<DatosEmpleo>(urlEmpleado).subscribe({
      next: datos => {
        this.regional.set(datos?.regionalesDescripcion || '')
        this.establecimiento.set(datos?.oficinasDescripcion || '')
      },
    })
  }
}
