import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { InputTextModule } from 'primeng/inputtext'
import { MenubarModule } from 'primeng/menubar'
import { PaginatorModule } from 'primeng/paginator'
import { PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select'
import { TableModule } from 'primeng/table'
import { LocalStorage, MenubarService, PageResponse, PermisosResponse, RegionalDistrital, UbicacionService } from 'shared'
import { CentroMedico, CentroMedicoService } from 'vigencia'

import { EstadosOptions } from '../../../models/estados-options'
import { UsuarioConfiguracion } from '../../../models/usuario-configuracion'
import { ConsultorioUsuarioService } from '../../../services/consultorio-usuario.service'
import { ConsultorioUsuarioForm } from '../consultorio-usuario-form/consultorio-usuario-form'
@Component({
  selector: 'lib-consultorio-usuario-list',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    SelectModule,
    MenubarModule,
    ConfirmDialogModule,
    ConsultorioUsuarioForm,
  ],
  templateUrl: './consultorio-usuario-list.html',
  styleUrl: './consultorio-usuario-list.scss',
})
export class ConsultorioUsuarioList implements OnInit {
  data = signal<PageResponse<UsuarioConfiguracion> | null>(null)
  items = signal<UsuarioConfiguracion[]>([])
  total = 0
  rows = 15

  menuTable: MenuItem[] = []
  search = ''

  showForm = false
  blockGrid = false
  loadingGrid = false

  estados = signal<EstadosOptions[]>([
    { value: null, label: 'TODOS' },
    { value: true, label: 'ACTIVO' },
    { value: false, label: 'INACTIVO' },
  ])
  estadoSelected: boolean | null = null

  openForm = false
  selectedItem: UsuarioConfiguracion | undefined
  dataForm: UsuarioConfiguracion | undefined

  params: PermisosResponse | null = null

  regionalId = 0
  centroMedicoId = 0

  regionales = signal<RegionalDistrital[]>([])
  regionalSelected = signal<number>(0)
  centrosMedicos = signal<CentroMedico[]>([])
  centroMedicoSelected = signal<number>(0)

  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)
  private consultorioUsuarioService = inject(ConsultorioUsuarioService)
  private centroMedicoService = inject(CentroMedicoService)
  private menuBarService = inject(MenubarService)
  private ubicacionService = inject(UbicacionService)
  private localStorage = inject(LocalStorage)

  ngOnInit(): void {
    const keyParam = 'Usuarios'
    this.getRegionales()
    const paramsRaw = this.localStorage.getKey(keyParam)
    this.params = paramsRaw ? JSON.parse(paramsRaw) : null
    if (this.params) {
      const regionales = this.params.data.find((item) => item.nombre == 'regional')
      if (regionales) {
        if (regionales?.valores.length == 1) {
          this.regionalSelected.set((this.regionalId = Number(regionales.valores[0].valor)))
        }
      }
      this.getCentrosMedicos()
      const centros = this.params.data.find((item) => item.nombre == 'centroMedico')
      if (this.regionalId > 0 && centros) {
        if (centros?.valores.length == 1) {
          this.centroMedicoSelected.set((this.centroMedicoId = Number(centros.valores[0].valor)))
        }
      }
    }
    this.getData(1, 10)
    this.changeStateMenu(true)
  }

  onChangeEstado() {
    this.getData(1, 10)
  }

  paginate($event: PaginatorState) {
    this.getData(($event.page ?? 0) + 1, 10)
  }

  getData(page: number, take: number) {
    const filter = {
      ubicacionId: this.regionalSelected(),
      centroMedicoId: this.centroMedicoSelected(),
      estado: this.estadoSelected,
      search: this.search,
      pageNumber: page,
      pageSize: take,
    }
    this.loadingGrid = true
    this.consultorioUsuarioService.getPage(filter).subscribe(response => {
      const data = response as PageResponse<UsuarioConfiguracion>
      this.data.set(data)
      this.items.set(data.items ?? [])
      this.total = data.total
      this.loadingGrid = false
    })
  }

  delete() {
    if (!this.dataForm?.id) {
      return
    }
    const id = this.dataForm.id
    this.confirmationService.confirm({
      message: `¿Desea eliminar el registro de ${this.dataForm.usuario?.nombres}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Si',
      accept: () => {
        this.consultorioUsuarioService.delete(id).subscribe(response => {
          this.getData(1, 10)
          this.changeStateMenu(true)
          this.dataForm = undefined
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se borró correctamente el horario',
          })
          return response
        })
      },
      rejectLabel: 'No',
      reject: () => {
        return
      },
    })
  }

  onRowSelect() {
    this.showForm = false
    this.changeStateMenu(false)
    this.dataForm = this.selectedItem
  }

  onRowUnselect() {
    this.changeStateMenu(true)
  }

  changeStateMenu(value: boolean) {
    this.menuTable = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus-circle',
        command: () => {
          this.openForm = true
          this.dataForm = undefined
        },
      },
    ]
    if (!value) {
      this.menuTable = [
        ...this.menuTable,
        {
          label: 'Editar',
          icon: 'pi pi-fw pi-pencil',
          styleClass: 'commonButtons',
          command: () => {
            this.openForm = true
          },
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-fw pi-trash',
          styleClass: 'commonButtons',
          command: () => {
            this.delete()
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

  getRegionales() {
    this.ubicacionService.getAll({}).subscribe(response => {
      this.regionales.set(response)
      this.menuBarService.hideOptions('regional', response, 'id', this.params!, null)
    })
  }

  onChangeRegional() {
    this.centrosMedicos.set([])
    this.centroMedicoSelected.set(0)
    this.getCentrosMedicos()
  }

  getCentrosMedicos() {
    this.centroMedicoService
      .getAll({
        ubicacionRegionalId: this.regionalSelected(),
      })
      .subscribe(response => {
        this.centrosMedicos.set(response)
        this.menuBarService.hideOptions('centroMedico', response, 'id', this.params!, null)
      })
  }

  getDescripcionCentroMedico(id: number) {
    return this.centrosMedicos().find((x) => x.id == id)?.descripcion
  }

  getdescripcionRegional(id: number | string) {
    const idStr = id?.toString()
    return this.regionales().find((x) => x.id == idStr)?.descripcion
  }

  onChangeCentroMedico() {
    this.getData(1, 10)
  }
}
