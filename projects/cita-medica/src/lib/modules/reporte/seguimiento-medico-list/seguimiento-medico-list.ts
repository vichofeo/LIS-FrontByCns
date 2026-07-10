import { CommonModule, DatePipe } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DatePickerModule } from 'primeng/datepicker'
import { DrawerModule } from 'primeng/drawer'
import { InputTextModule } from 'primeng/inputtext'
import { MenubarModule } from 'primeng/menubar'
import { PaginatorModule } from 'primeng/paginator'
import { SelectModule } from 'primeng/select'
import { TableModule } from 'primeng/table'
import { forkJoin } from 'rxjs'
import { LocalStorage, MenubarService, PdfViewer, UbicacionService } from 'shared'
import { CentroMedicoService, ConsultorioService, ParametricasService } from 'vigencia'

import {
  ConsultorioHorarioService,
  ReporteService,
  ReportesCitasMedicasService,
} from '../../../services'

@Component({
  selector: 'lib-seguimiento-medico-list',
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    InputTextModule,
    SelectModule,
    TableModule,
    PaginatorModule,
    DatePickerModule,
    ConfirmDialogModule,
    DrawerModule,
    PdfViewer,
  ],
  templateUrl: './seguimiento-medico-list.html',
  styleUrl: './seguimiento-medico-list.scss',
})
export class SeguimientoMedicoList implements OnInit {
  data: any
  items = signal<any[]>([])
  total = 0
  rows = 10
  menuTable: MenuItem[] = []
  search = ''
  selectedItem: any
  showForm = false
  blockGrid = false
  loadingGrid = false
  regional = signal<any>(null)
  regionalId = 0
  centrosMedicos = signal<any>([])
  centroMedicoSelected: any
  consultorios = signal<any>([])
  consultorioSelected: any = []
  tiposEspecialidad: any
  tipoEspecialidadSelected: any = []
  medicos = signal<any>([])
  medicoSelected: any
  openForm = false
  dataForm: any
  params: any
  allConsultorios: any = []
  date: Date[] = []
  dateIni: Date = new Date()
  dateFin: Date = new Date()

  pdf: any
  fullSideBar = false
  fileBlob: any

  diasSemana: string[] = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']
  horarios = signal<any>([])

  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)
  private ubicacionService = inject(UbicacionService)
  private centroMedicoService = inject(CentroMedicoService)
  private consultorioService = inject(ConsultorioService)
  private localStorage = inject(LocalStorage)
  private menuBarService = inject(MenubarService)
  private parametricasService = inject(ParametricasService)
  private consultorioHorarioService = inject(ConsultorioHorarioService)
  private reportesCitasMedicas = inject(ReportesCitasMedicasService)
  private datePipe = inject(DatePipe)
  private reporteService = inject(ReporteService)

  ngOnInit(): void {
    const date1 = new Date()
    const date2 = new Date()
    date2.setDate(date1.getDate() - 30)
    this.dateIni = date2
    this.dateFin = date1
    this.getDataDropdowns()
    const keyParam = 'Seguimiento a Atenciones'
    this.params = this.localStorage.getKey(keyParam)
    this.params = this.params ? JSON.parse(this.params) : null
    if (this.params) {
      const regionales = this.params.data.find((item: any) => item.nombre == 'regional')
      if (regionales) {
        this.regionalId = Number(regionales.valores[0].valor)
        this.getRegional()
      }
    }
    this.changeStateMenu(true)
  }

  getDataDropdowns() {
    forkJoin([
      this.parametricasService.getTipoEspecialidad({}),
      this.consultorioService.getAllConsultorios({}),
    ]).subscribe(allResult => {
      if (allResult[0].length > 0) {
        this.tiposEspecialidad = [{ id: 0, descripcion: 'TODOS' }, ...allResult[0]]
        this.tipoEspecialidadSelected = 0
      }
      this.allConsultorios = allResult[1]
    })
  }

  getRegional() {
    this.ubicacionService.getById(this.regionalId).subscribe(response => {
      this.regional.set(response)
      if (response) {
        this.getCentrosMedicos()
      }
    })
  }

  getCentrosMedicos() {
    this.centroMedicoService
      .getAll({ ubicacionRegionalId: this.regional()?.id })
      .subscribe(response => {
        this.centrosMedicos.set(response)
        this.menuBarService.hideOptions('centroMedico', response, 'id', this.params, null)
        this.centroMedicoSelected =
          this.centrosMedicos().length > 1 ? 0 : this.centrosMedicos()[0].id
        if (this.centroMedicoSelected > 0) {
          this.getConsultorios()
        }
      })
  }

  onChangeCentroMedico() {
    this.consultorios.set([])
    this.medicos.set([])
    this.getConsultorios()
  }

  getConsultorios() {
    this.consultorioHorarioService
      .getByCentroMedico({ centroMedicoId: this.centroMedicoSelected })
      .subscribe(response => {
        const consultorioHorariosByCentroMedico = response
        if (consultorioHorariosByCentroMedico.length > 0) {
          const idsConsultorios = consultorioHorariosByCentroMedico.map((x: any) => {
            return x.consultorioId
          })
          this.consultorioService
            .getByIds({ ids: idsConsultorios, tipoEspecialidad: this.tipoEspecialidadSelected })
            .subscribe(response => {
              this.consultorios.set(response)
              if (response.length > 0) {
                this.consultorios.set([{ id: 0, descripcion: 'TODOS' }, ...this.consultorios()])
                this.consultorioSelected = 0
                this.getData(1, 10)
              }
            })
        }
      })
  }

  onChangeConsultorio() {
    this.medicos.set([])
    this.getMedicos()
  }

  getMedicos() {
    const data = {
      consultorioId: this.consultorioSelected,
      fechaInicio: this.datePipe.transform(this.dateIni, 'yyyy-MM-dd'),
      fechaFin: this.datePipe.transform(this.dateFin, 'yyyy-MM-dd'),
    }
    this.consultorioHorarioService.getMedicosByRange(data).subscribe(response => {
      this.medicos.set(response)
      if (response.length > 0) {
        this.medicos.set([{ id: null, nombres: 'TODOS' }, ...this.medicos()])
        this.medicoSelected = this.medicos().length == 1 ? this.medicos()[0].id : null
      }
      this.getData(1, 10)
    })
  }

  getHorarios() {
    const data = {
      consultorioId: this.consultorioSelected,
      medicoUsuarioId: this.medicoSelected,
      fechaInicio: this.datePipe.transform(this.dateIni, 'yyyy-MM-dd'),
      fechaFin: this.datePipe.transform(this.dateFin, 'yyyy-MM-dd'),
    }
    this.consultorioHorarioService.getHorariosByRange(data).subscribe(response => {
      this.horarios.set(response)
    })
  }

  onChangeMedico() {
    this.getHorarios()
    this.getData(1, 10)
  }

  paginate($event: any) {
    this.getData($event.page + 1, 10)
  }

  getData(page: number, take: number) {
    if (this.centroMedicoSelected > 0) {
      const filter = {
        regionalId: this.regional()?.id,
        centroMedicoId:
          this.centroMedicoSelected == undefined || this.centroMedicoSelected == null
            ? 0
            : this.centroMedicoSelected,
        consultorioId:
          this.consultorioSelected == undefined || this.consultorioSelected == null
            ? 0
            : this.consultorioSelected,
        medicoUsuarioId:
          this.medicoSelected == undefined || this.medicoSelected == null
            ? ''
            : this.medicoSelected,
        search: this.search,
        fechaInicio: this.datePipe.transform(this.dateIni, 'yyyy-MM-dd'),
        fechaFin: this.datePipe.transform(this.dateFin, 'yyyy-MM-dd'),
        pageNumber: page,
        pageSize: take,
      }
      this.loadingGrid = true
      this.reportesCitasMedicas.getSeguimientoMedico(filter).subscribe((response: any) => {
        this.data = response
        this.items.set(this.data.items)
        this.total = this.data.total
        this.loadingGrid = false
      })
    }
  }

  delete() {
    this.confirmationService.confirm({
      message: `¿Desea eliminar ${this.dataForm.descripcion}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Si',
      accept: () => {
        this.consultorioService.delete(this.dataForm.id).subscribe((response: any) => {
          this.getData(1, 10)
          this.changeStateMenu(true)
          this.dataForm = undefined
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se borró correctamente el consultorio',
          })
          return response
        })
      },
      rejectLabel: 'No',
    })
  }

  onRowSelect(event: any) {
    this.showForm = false
    this.changeStateMenu(false)
    this.dataForm = event.data
  }

  onRowUnselect(event: any) {
    this.changeStateMenu(true)
  }

  closeForm() {
    this.showForm = false
    this.blockGrid = false
  }

  changeStateMenu(value: boolean) {
    if (value) {
      this.menuTable = [
        {
          label: 'Imprimir',
          icon: 'pi pi-fw pi-print',
          styleClass: 'commonButtons',
          command: () => {
            this.print()
          },
        },
      ]
    } else {
      this.menuTable = [
        {
          label: 'Imprimir',
          icon: 'pi pi-fw pi-print',
          styleClass: 'commonButtons',
          command: () => {
            this.print()
          },
        },
      ]
    }
  }

  handleCloseForm($event: boolean) {
    this.openForm = $event
    if ($event) {
      this.openForm = false
      this.getData(1, 10)
    }
  }

  print() {
    const centro: any = this.centrosMedicos()?.find((x: any) => x.id == this.centroMedicoSelected)
    const consultorio: any = this.consultorios()?.find((x: any) => x.id == this.consultorioSelected)
    const consultorioHorario: any = this.medicos()?.find((x: any) => x.id == this.medicoSelected)
    const medico =
      this.consultorioSelected == 0
        ? 'TODOS'
        : this.medicoSelected == 0
          ? 'TODOS'
          : consultorioHorario.medicoUsuario?.nombres
    const fechaInicio: any = this.datePipe.transform(this.dateIni, 'yyyy-MM-dd')
    const fechaFin: any = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd')
    const consultorioId =
      this.consultorioSelected == undefined || this.consultorioSelected == null
        ? 0
        : this.consultorioSelected
    const conultorioHorarioId =
      this.medicoSelected == undefined || this.medicoSelected == null ? 0 : this.medicoSelected
    this.reporteService
      .getSeguimientoMedico(
        this.centroMedicoSelected,
        consultorioId,
        conultorioHorarioId,
        fechaInicio,
        fechaFin,
        this.regional()?.descripcion,
        centro?.descripcion,
        consultorio?.descripcion,
        medico,
      )
      .subscribe(response => {
        this.fileBlob = response
        this.pdf = {
          url: URL.createObjectURL(this.fileBlob),
          blob: this.fileBlob,
        }
        this.fullSideBar = true
      })
  }

  getConsultorioDescripcion(id: number) {
    const cons = this.allConsultorios.find((x: any) => x.id == id)
    return cons
  }

  onSelectCalendar() {
    this.getData(1, 10)
  }

  onCloseCalendar() {
    this.getData(1, 10)
  }

  changeColor($event: any) {
    //
  }

  esDiaMarcado(diasAtencion: number[], dia: number): boolean {
    return diasAtencion?.includes(dia)
  }
}
