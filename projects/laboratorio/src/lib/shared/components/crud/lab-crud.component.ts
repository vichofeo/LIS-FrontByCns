import { Component, Input, OnInit, ViewChild, computed, inject, signal } from '@angular/core'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ToastModule } from 'primeng/toast'
import { firstValueFrom } from 'rxjs'

import { DynamicEntityData, DynamicFormCampos } from '../../models/dynamic-api.models'
import { DynamicApiService } from '../../services/dynamic-api.service'
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component'
import { DynamicFieldConfig, DynamicFormSchema, FieldTypeCode } from '../dynamic-form/dynamic-form.models'
import { TableCheckComponent } from '../table/table-check.component'
import { TableColumn } from '../table/table-check.models'

interface CamposItem { value: string; text: string }

@Component({
  selector: 'lab-crud',
  standalone: true,
  providers: [MessageService],
  imports: [CardModule, ButtonModule, DialogModule, ProgressSpinnerModule, ToastModule, TableCheckComponent, DynamicFormComponent],
  template: `
    <p-toast />

    <p-card>
      <ng-template pTemplate="title">
        <div class="flex justify-content-between align-items-center">
          <span class="font-bold text-lg">{{ tituloCentral }}</span>
          <button pButton label="Nuevo registro" icon="pi pi-plus" class="p-button-sm" (click)="nuevo()"></button>
        </div>
      </ng-template>
      <ng-template pTemplate="content">
        @if (loading()) {
          <div class="flex justify-content-center p-4">
            <p-progressSpinner />
          </div>
        } @else if (items().length === 0) {
          <div class="text-center text-500 p-4">-Sin Dato-</div>
        } @else {
          <lab-table-check
          [itemsPerPage]="10"
          [withDel]="true"
          [withEdit]="true"
          [showSelect]="false"

            [columns]="columns()"
            [data]="items()"
            [columns]="columns()"
            [data]="items()"
            
            
            
            [singleSelect]="true"
            [globalFilterFields]="filterFields()"
            (editItem)="onEdit($event)"
            (deleteItem)="onDelete($event)"
          />
        }
      </ng-template>
    </p-card>

    <p-dialog
      [(visible)]="swPopup"
      [header]="tituloPopup"
      [modal]="true"
      [style]="{ width: 'min(60vw, 900px)' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="cancelar()"
    >
      @if (formLoading()) {
        <div class="flex justify-content-center p-4">
          <p-progressSpinner />
        </div>
      } @else if (formSchema()) {
        <lab-dynamic-form
          #dynamicForm
          [schema]="formSchema()!"
          [lengthCols]="lengthCols"
        />
      }
      <ng-template pTemplate="footer">
        <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text" (click)="cancelar()"></button>
        <button pButton label="Guardar" icon="pi pi-check" (click)="guardar()" [loading]="saving()" [disabled]="formLoading()"></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host { display: block; }
    .text-500 { color: #6b7280; }
  `],
})
export class LabCrudComponent implements OnInit {
  private api = inject(DynamicApiService)
  private toast = inject(MessageService)

  @Input({ required: true }) modelo!: string
  @Input({ required: true }) carpeta!: string
  @Input() tituloCentral = 'Datos'
  @Input() tituloPopup = 'Datos seleccionados'
  @Input() lengthCols = 3

  @ViewChild('dynamicForm') dynamicForm!: DynamicFormComponent

  private rawCampos = signal<any>({})
  private rawData = signal<any[]>([])

  protected loading = signal(false)
  protected formLoading = signal(false)
  protected saving = signal(false)
  protected swPopup = signal(false)
  protected isNew = signal(false)
  protected selectedIdx = signal<string | null>(null)
  protected linked = signal('-None-')

  protected items = computed(() => this.rawData())

  protected singleSelect = computed(() => this.rawData().length > 0)

  protected columns = computed<TableColumn[]>(() => {
    const campos = this.rawCampos()
    if (Array.isArray(campos)) {
      return (campos as CamposItem[]).map(c => ({
        field: c.value,
        header: c.text,
        sortable: true,
      }))
    }
    if (typeof campos === 'object' && campos !== null) {
      return Object.entries(campos as DynamicFormCampos).map(([field, campo]) => ({
        field,
        header: campo[0],
        sortable: true,
      }))
    }
    return []
  })

  protected filterFields = computed<string[]>(() => this.columns().map(c => c.field))

  protected formSchema = signal<DynamicFormSchema | null>(null)

  ngOnInit(): void {
    this.loadData()
  }

  private async loadData(): Promise<void> {
    this.loading.set(true)
    try {
      const res = await firstValueFrom(this.api.get(this.carpeta, this.modelo))
      if (res.ok) {
        const key = Object.keys(res.data)[0]
        const entity = res.data[key]
        this.rawCampos.set(entity.campos)
        this.linked.set(entity.linked || '-None-')
        if (Array.isArray(entity.valores)) {
          this.rawData.set(entity.valores as any[])
        } else {
          this.rawData.set([])
        }
      } else {
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
      const res = await firstValueFrom(this.api.get(this.carpeta, this.linked(), { idx }))
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
    const campos = entity.campos
    const valores = (entity.valores as Record<string, any>) || {}
    const sectionCampos: Record<string, DynamicFieldConfig> = {}

    if (Array.isArray(campos)) {
      for (const c of campos as CamposItem[]) {
        sectionCampos[c.value] = {
          label: c.text,
          editable: true,
          required: false,
          typeCode: 'TT' as FieldTypeCode,
        }
      }
    } else {
      for (const [field, campo] of Object.entries(campos as DynamicFormCampos)) {
        sectionCampos[field] = {
          label: campo[0],
          editable: campo[1],
          required: campo[2],
          typeCode: campo[3] as FieldTypeCode,
          maxLength: campo[4],
        }
      }
    }

    this.formSchema.set({
      datos: {
        label: 'Datos',
        linked: entity.linked,
        model: this.modelo,
        campos: sectionCampos,
        valores,
      },
    })
  }

  protected nuevo(): void {
    this.isNew.set(true)
    this.selectedIdx.set(null)
    this.swPopup.set(true)
    this.loadSingleRecord('-1')
  }

  protected onEdit(item: any): void {
    if (!item) return
    const idx = item.idx ?? item.idl ?? undefined
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

      if (this.isNew()) {
        await firstValueFrom(this.api.post(this.carpeta, this.modelo, body))
      } else {
        await firstValueFrom(this.api.put(this.carpeta, this.modelo, body))
      }

      this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado correctamente', life: 5000 })
      this.swPopup.set(false)
      this.formSchema.set(null)
      await this.loadData()
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar', life: 8000 })
    }
    this.saving.set(false)
  }

  protected async onDelete(item: any): Promise<void> {
    const idx = item?.idx ?? item?.idl
    if (idx === undefined || idx === null) return

    const confirmed = window.confirm('¿Está seguro de eliminar este registro?')
    if (!confirmed) return

    this.loading.set(true)
    try {
      await firstValueFrom(this.api.remove(this.carpeta, this.modelo, String(idx)))
      this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente', life: 5000 })
      await this.loadData()
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar', life: 8000 })
    }
    this.loading.set(false)
  }
}
