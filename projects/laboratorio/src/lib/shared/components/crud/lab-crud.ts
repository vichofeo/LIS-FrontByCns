import { Component, Input, OnInit, ViewChild, computed, inject, signal } from '@angular/core'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ToastModule } from 'primeng/toast'
import { firstValueFrom } from 'rxjs'

import { DynamicEntityData, DynamicFormCampos, DynamicListCampos, DynamicListItem } from '../../models/dynamic-api.models'
import { DynamicApiService } from '../../services/dynamic-api.service'
import { toDynamicFormSchema } from '../../utils/dynamic-form-schema.util'
import { DynamicForm } from '../dynamic-form/dynamic-form'
import { DynamicFormSchema } from '../dynamic-form/dynamic-form.models'
import { TableCheck } from '../table/table-check'
import { TableColumn, TableRow } from '../table/table-check.models'

@Component({
  selector: 'lab-crud',
  standalone: true,
  providers: [MessageService],
  imports: [CardModule, ButtonModule, ConfirmDialogModule, DialogModule, ProgressSpinnerModule, ToastModule, TableCheck, DynamicForm],
  templateUrl: './lab-crud.html',
  styleUrl: './lab-crud.scss',
})
export class LabCrud implements OnInit {
  @Input({ required: true }) modelo!: string
  @Input({ required: true }) dominio!: string
  @Input() tituloCentral = 'Datos'
  @Input() tituloPopup = 'Datos seleccionados'
  @Input() lengthCols = 3

  @ViewChild('dynamicForm') dynamicForm!: DynamicForm

  protected loading = signal(false)
  protected formLoading = signal(false)
  protected saving = signal(false)
  protected swPopup = signal(false)
  protected isNew = signal(false)
  protected selectedIdx = signal<string | null>(null)
  protected linked = signal('-None-')

  protected items = computed(() => this.rawData())

  protected columns = computed<TableColumn[]>(() => {
    const campos = this.rawCampos()
    if (Array.isArray(campos)) {
      return campos.map(c => ({
        field: c.value,
        header: c.text,
        sortable: true,
      }))
    }
    return Object.entries(campos).map(([field, campo]) => ({
      field,
      header: campo[0],
      sortable: true,
    }))
  })

  protected filterFields = computed<string[]>(() => this.columns().map(c => c.field))

  protected formSchema = signal<DynamicFormSchema | null>(null)

  private api = inject(DynamicApiService)
  private toast = inject(MessageService)
  private rawCampos = signal<DynamicFormCampos | DynamicListCampos[]>({})
  private rawData = signal<DynamicListItem[]>([])

  ngOnInit(): void {
    this.loadData()
  }

  protected nuevo(): void {
    this.isNew.set(true)
    this.selectedIdx.set(null)
    this.swPopup.set(true)
    this.loadSingleRecord('-1')
  }

  protected onEdit(item: TableRow): void {
    if (!item) return
    const idx = item['idx'] ?? item['idl'] ?? undefined
    if (idx !== undefined) {
      this.isNew.set(false)
      this.selectedIdx.set(String(idx))
      this.swPopup.set(true)
      this.loadSingleRecord(String(idx))
    }
  }

  protected cancelar(): void {
    this.swPopup.set(false)
    this.formSchema.set(null)
  }

  protected async guardar(): Promise<void> {
    const form = this.dynamicForm
    if (!form) return

    if (!form.validate()) {
      this.toast.add({ severity: 'warn', summary: 'Validación', detail: 'Complete todos los campos obligatorios', life: 6000 })
      return
    }

    const values = form.getFormValues()
    this.saving.set(true)
    try {
      const body = {
        idx: this.selectedIdx(),
        ...values['datos'],
      }

      await firstValueFrom(this.api.save(this.dominio, this.linked(), body))

      this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado correctamente', life: 5000 })
      this.swPopup.set(false)
      this.formSchema.set(null)
      await this.loadData()
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar', life: 8000 })
    }
    this.saving.set(false)
  }

  protected onDelete(item: TableRow): void {
    const idx = item?.['idx'] ?? item?.['idl']
    if (idx === undefined || idx === null) return

    this.toast.add({
      severity: 'warn',
      summary: 'No disponible',
      detail: 'El backend aún no expone un endpoint de eliminación',
      life: 5000,
    })
  }

  private async loadData(): Promise<void> {
    this.loading.set(true)
    try {
      const res = await firstValueFrom(this.api.get(this.dominio, this.modelo))
      if (res.ok) {
        const key = Object.keys(res.data)[0]
        const entity = res.data[key]
        this.rawCampos.set(entity.campos)
        this.linked.set(entity.linked || '-None-')
        if (Array.isArray(entity.valores)) {
          this.rawData.set(entity.valores)
        } else {
          this.rawData.set([])
        }
      } else {
        console.error('Error al obtener datos:', res)
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener datos', life: 8000 })
      }
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error de conexión con el servidor', life: 8000 })
    }
    this.loading.set(false)
  }

  private async loadSingleRecord(idx: string): Promise<void> {
    this.formLoading.set(true)
    this.formSchema.set(null)
    try {
      const res = await firstValueFrom(this.api.get(this.dominio, this.linked(), { idx }))
      if (res.ok) {
        const key = Object.keys(res.data)[0]
        const entity = res.data[key]
        this.buildFormSchema(entity)
      } else {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener datos', life: 8000 })
      }
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error de conexión con el servidor', life: 8000 })
    }
    this.formLoading.set(false)
  }

  private buildFormSchema(entity: DynamicEntityData): void {
    this.formSchema.set(toDynamicFormSchema(entity, this.modelo))
  }
}
