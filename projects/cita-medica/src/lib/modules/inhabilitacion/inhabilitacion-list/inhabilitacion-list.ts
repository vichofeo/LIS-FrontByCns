import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { MenubarModule } from 'primeng/menubar'
import { MessageModule } from 'primeng/message'
import { PaginatorModule } from 'primeng/paginator'
import { PaginatorState } from 'primeng/paginator'
import { SelectModule } from 'primeng/select'
import { Table, TableModule } from 'primeng/table'
import { forkJoin } from 'rxjs'
import {
  LocalStorage,
  MenubarService,
  NotificationService,
  Ubicacion,
  UbicacionService,
} from 'shared'
import { CentroMedicoService, ConsultorioService } from 'vigencia'

import { DataResponse, Inhabilitacion, Usuario } from 'cita-medica'

import { CentroMedico, Consultorio } from '../../../../../../vigencia/src/lib/models'
import { InhabilitacionService } from '../../../services'


@Component({
  selector: 'lib-inhabilitacion-list',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    TableModule,
    PaginatorModule,
    MenubarModule,
    MessageModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './inhabilitacion-list.html',
  styleUrl: './inhabilitacion-list.scss',
})
export class InhabilitacionList implements OnInit {
  regionales: Ubicacion[] = []
  regionalSelected!: number
  centrosMedicos: CentroMedico[] = []
  centrosMedicosCopy: CentroMedico[] = []
  centroMedicoSelected!: number
  regional = signal<Ubicacion | null>(null)
  centroMedico = signal<CentroMedico | undefined>(undefined)
  regionalId = 0
  centroMedicoId = 0
  allConsultorios: Consultorio[] = []
  medicos = signal<Usuario[]>([])

  data!: DataResponse
  items = signal<Inhabilitacion[]>([])
  total = 0
  rows = 10

  menuTable: MenuItem[] = []
  search = ''
  selectedItem: Inhabilitacion | null = null
  showForm = false
  blockGrid = false
  loadingGrid = false
  openForm = false
  dataForm: any

  expandedRow: Inhabilitacion | null = null

  @ViewChild('grid') grid!: Table
  params: any
  medicosList = signal<Usuario[]>([])

  private ubicacionService = inject(UbicacionService)
  private centroMedicoService = inject(CentroMedicoService)
  private consultorioService = inject(ConsultorioService)
  private inhabilitacionService = inject(InhabilitacionService)
  private menuBarService = inject(MenubarService)
  private localStorage = inject(LocalStorage)
  private notificationService = inject(NotificationService)

  ngOnInit(): void {
    const keyParam = 'Inhabilitacion'
    this.params = this.localStorage.getKey(keyParam)
    this.params = this.params ? JSON.parse(this.params) : null
    if (this.params) {
      const regionales = this.params.data.find((item: any) => item.nombre == 'regional')
      if (regionales) {
        if (regionales?.valores.length == 1) {
          this.regionalSelected = this.regionalId = Number(regionales.valores[0].valor)
        }
      }
      const centros = this.params.data.find((item: any) => item.nombre == 'centroMedico')
      if (this.regionalId > 0 && centros) {
        if (centros?.valores.length == 1) {
          this.centroMedicoId = Number(centros.valores[0].valor)
        } else {
          this.getCentrosMedicos()
        }
      }
    }
    this.changeStateMenu()
    this.getDataDropdowns()
  }

  getDataDropdowns() {
    forkJoin([
      this.consultorioService.getAllConsultorios({}),
      this.ubicacionService.getAll({}),
    ]).subscribe((allResult: any) => {
      this.allConsultorios = allResult[0]
      this.regionales = allResult[1]
      this.getDataRegionales()
    })
  }

  getDataRegionales() {
    this.regionales = this.menuBarService.hideOptions(
      'regional',
      this.regionales,
      'id',
      this.params,
      null,
    )
    this.regionalSelected = this.regionales[0].id
    if (this.regionalSelected > 0) {
      this.regional.set(
        this.regionales.find((x: Ubicacion) => x.id === this.regionalSelected) ?? null,
      )
      this.onChangeRegional()
    }
  }

  onChangeRegional() {
    ; (document.activeElement as HTMLElement)?.blur()
    this.centrosMedicos = this.centrosMedicosCopy = []
    this.centroMedicoSelected = 0
    this.regionalId = this.regionalSelected
    this.changeStateMenu()
    this.getCentrosMedicos()
  }

  getCentrosMedicos() {
    this.centroMedicoService
      .getAll({ ubicacionRegionalId: this.regionalSelected })
      .subscribe(response => {
        this.centrosMedicosCopy = this.centrosMedicos = response
        this.centrosMedicos = [{ id: 0, descripcion: 'TODOS' }, ...this.centrosMedicos]
        this.centrosMedicos = this.menuBarService.hideOptions(
          'centroMedico',
          this.centrosMedicos,
          'id',
          this.params,
          null,
        )
        this.centroMedicoId = this.centroMedicoSelected = this.centrosMedicos[0].id
        if (this.centroMedicoSelected > 0) {
          this.centroMedico.set(
            this.centrosMedicos.find((x: CentroMedico) => x.id === this.centroMedicoSelected),
          )
        }
        this.onChangeCentroMedico()
      })
  }

  onChangeCentroMedico() {
    ; (document.activeElement as HTMLElement)?.blur()
    this.centroMedicoId = this.centroMedicoSelected
    this.centroMedico.set(
      this.centrosMedicos.find((x: CentroMedico) => x.id == this.centroMedicoSelected),
    )
    this.getData(1, 10)
  }

  changeStateMenu() {
    if (this.regionalSelected > 0) {
      this.menuTable = [
        {
          label: 'Agregar',
          icon: 'pi pi-fw pi-plus-circle',
          styleClass: 'commonButtons',
          command: () => {
            this.dataForm = null
            this.openForm = true
          },
        },
      ]
    }
    if (this.selectedItem) {
      this.menuTable = [
        ...this.menuTable,
        {
          label: 'Editar',
          icon: 'pi pi-fw pi-pencil',
          styleClass: 'commonButtons',
          command: () => {
            this.dataForm = this.selectedItem
            this.openForm = true
          },
        },
      ]
    }
  }

  getData(page: number, take: number) {
    this.selectedItem = null
    const data = { data: this.expandedRow }
    this.onRowUnselect(data)
    const filter = {
      regionalId: this.regionalSelected,
      centroMedicoId: this.centroMedicoSelected,
      search: this.search,
      pageNumber: page,
      pageSize: take,
    }
    this.loadingGrid = true
    this.inhabilitacionService.getPageRegional(filter).subscribe(response => {
      this.data = response
      this.items.set(this.data.items)
      this.total = this.data.total
      this.loadingGrid = false
      const ids = this.items().map((w: Inhabilitacion) => {
        return w.id
      })
      this.getAllMedicos(ids)
    })
  }

  getAllMedicos(ids: number[]) {
    const queryParams = ids.join(',')
    this.inhabilitacionService
      .getMedicosDetalle({ idsInhabilitacion: queryParams })
      .subscribe(response => {
        this.medicosList.set(response)
      })
  }

  onRowSelect() {
    this.medicos.set([])
    if (this.centrosMedicos.length > 1) {
      if (this.expandedRow && this.expandedRow !== this.selectedItem) {
        this.grid.toggleRow(this.expandedRow)
      }
      this.grid.toggleRow(this.selectedItem)
      this.expandedRow = this.selectedItem
      this.getMedicos(this.selectedItem)
    }

    this.changeStateMenu()
  }

  onRowUnselect(event: any) {
    const item = event.data
    this.grid.toggleRow(item)
    this.expandedRow = null
    this.changeStateMenu()
  }

  getMedicos(item: Inhabilitacion | null) {
    this.inhabilitacionService.getMedicos({ inhabilitacionId: item?.id }).subscribe(response => {
      this.medicos.set(response)
    })
  }

  paginate(event: PaginatorState): void {
    this.getData((event.page ?? 0) + 1, event.rows ?? 10)
  }

  handleCloseForm($event: boolean) {
    this.openForm = $event
    if ($event) {
      this.openForm = false
      this.getData(1, 10)
      this.changeStateMenu()
    }
  }

  getDescripcionCentros(inhabilitacion: Inhabilitacion) {
    const centros = this.centrosMedicosCopy.filter((x: CentroMedico) =>
      inhabilitacion.idsCentroMedico?.some((sc: number) => sc == x.id),
    )
    return centros
  }

  getDescripcionMedicos(inhabilitacion: Inhabilitacion) {
    return this.medicosList()
      .filter((medico: Usuario) => inhabilitacion.idsMedicoUsuario.includes(medico.id))
      .sort((a, b) => a.nombres.localeCompare(b.nombres))
  }
}
