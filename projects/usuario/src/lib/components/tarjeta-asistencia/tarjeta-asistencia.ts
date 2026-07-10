import { CommonModule } from '@angular/common'
import { Component, Input, OnChanges, OnInit, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { MessageModule } from 'primeng/message'
import { SelectModule } from 'primeng/select'
import { TableModule } from 'primeng/table'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'

import { Tarjeta, TarjetaDetalle } from '../../models/usuario'
import { RrhhMarcacionesService } from '../../services/rrhh-marcaciones.service'
import { RrhhTarjetaService } from '../../services/rrhh-tarjeta.service'

@Component({
  selector: 'lib-tarjeta-asistencia',
  imports: [
    SelectModule,
    FormsModule,
    MessageModule,
    TableModule,
    TagModule,
    TooltipModule,
    CommonModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './tarjeta-asistencia.html',
  styleUrl: './tarjeta-asistencia.scss',
})
export class TarjetaAsistencia implements OnChanges, OnInit {
  @Input() ci = ''
  @Input() id = 0
  @Input() reload = 0


  gestiones = signal<number[] | null>([])
  gesActual: number = new Date().getFullYear()
  mesActual: number = new Date().getMonth()

  dataTarjeta = signal<Tarjeta | null>(null)
  displayResponsive = signal<boolean>(false)
  displayMaximizable = signal<boolean>(false)
  eventos: TarjetaDetalle | null = null

  meses = [
    { code: 1, nombre: 'Enero' },
    { code: 2, nombre: 'Febrero' },
    { code: 3, nombre: 'Marzo' },
    { code: 4, nombre: 'Abril' },
    { code: 5, nombre: 'Mayo' },
    { code: 6, nombre: 'Junio' },
    { code: 7, nombre: 'Julio' },
    { code: 8, nombre: 'Agosto' },
    { code: 9, nombre: 'Septiembre' },
    { code: 10, nombre: 'Octubre' },
    { code: 11, nombre: 'Noviembre' },
    { code: 12, nombre: 'Diciembre' },
  ]

  private rrhhMarcacionesService = inject(RrhhMarcacionesService)
  private rrhhTarjetaService = inject(RrhhTarjetaService)

  get restanteMinutos(): number {
    return this.dataTarjeta()?.restanteMinutos ?? 0
  }

  ngOnChanges(): void {
    this.getGestiones()
  }

  ngOnInit(): void {
    this.getGestiones()
  }

  getGestiones() {
    this.rrhhMarcacionesService.getGestionesByPersonaId(this.id).subscribe(data => {
      this.gestiones.set(data)
      this.gesActual = data[0]
      const mesActual = new Date().getMonth() + 1
      const selectedMes = this.meses.find(x => x.code === mesActual) ?? null
      this.mesActual = selectedMes?.code ?? 0
      this.getTarjeta()
    })
  }

  onChangeGestion(obj: { value: number }): void {
    this.gesActual = obj.value
    this.getTarjeta()
  }

  onChangeMeses(obj: { value: number }): void {
    this.mesActual = obj.value
    this.getTarjeta()
  }

  getTarjeta() {
    this.rrhhTarjetaService
      .getTarjeta(this.id, this.ci, this.gesActual, this.mesActual)
      .subscribe((dataTarjeta: Tarjeta) => {
        this.dataTarjeta.set(dataTarjeta)
      })
  }

  showResponsiveDialog(obj: TarjetaDetalle): void {
    this.displayResponsive.set(true)
    let marcacionExcepcion: string[] | null = null
    if (typeof obj.marcacionExcepcion === 'string') {
      marcacionExcepcion = obj.marcacionExcepcion.trim().split(' ')
    } else if (Array.isArray(obj.marcacionExcepcion)) {
      marcacionExcepcion = obj.marcacionExcepcion
    }
    this.eventos = {
      ...obj,
      marcacionExcepcion,
    }
  }
}
