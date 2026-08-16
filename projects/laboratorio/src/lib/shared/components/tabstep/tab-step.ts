import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren, computed, inject, signal } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { StepsModule } from 'primeng/steps'
import { TabsModule } from 'primeng/tabs'
import { ToastModule } from 'primeng/toast'
import { firstValueFrom } from 'rxjs'

import { TabStepGroupItem } from './tabstep.models'
import { DynamicApiService } from '../../services/dynamic-api.service'
import { toDynamicFormSchema } from '../../utils/dynamic-form-schema.util'
import { DynamicForm } from '../dynamic-form/dynamic-form'
import { DynamicFormSchema } from '../dynamic-form/dynamic-form.models'

@Component({
  selector: 'lab-tab-step',
  standalone: true,
  providers: [MessageService],
  imports: [CardModule, ButtonModule, ProgressSpinnerModule, TabsModule, StepsModule, ToastModule, DynamicForm],
  templateUrl: './tab-step.html',
  styleUrl: './tab-step.scss',
})
export class TabStep implements OnInit {
  @Input({ required: true }) modelGroup!: string
  @Input() dominio = 'areas'
  @Input() idxSelected: string | null = null
  @Input() swStepper = false
  @Input() lengthCols = 6

  @Output() saved = new EventEmitter<unknown>()
  @Output() closed = new EventEmitter<void>()

  @ViewChildren('dynForm') private formEls!: QueryList<DynamicForm>

  protected tabs = signal<TabStepGroupItem[]>([])
  protected schemas = signal<Record<string, DynamicFormSchema>>({})
  protected loading = signal(false)
  protected saving = signal(false)
  protected activeIndex = signal(0)
  protected stepIndex = signal(0)

  protected stepsModel = computed<MenuItem[]>(() =>
    this.tabs().map(tab => ({
      label: tab.label,
      icon: this.iconClass(tab.icon),
      command: () => this.stepIndex.set(this.tabs().findIndex(t => t.model === tab.model)),
    })),
  )

  private api = inject(DynamicApiService)
  private toast = inject(MessageService)

  ngOnInit(): void {
    this.initial()
  }

  protected async initial(): Promise<void> {
    this.loading.set(true)
    try {
      const res = await firstValueFrom(this.api.agrupado(this.dominio, this.modelGroup))
      if (!res.ok) {
        this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: res.message || 'Error al obtener modelos', life: 8000 })
        return
      }

      this.tabs.set(res.data)
      const schemas: Record<string, DynamicFormSchema> = {}
      for (const tab of res.data) {
        const entityRes = this.idxSelected
          ? await firstValueFrom(this.api.get(this.dominio, tab.model, { idx: this.idxSelected }))
          : await firstValueFrom(this.api.get(this.dominio, tab.model))
        if (!entityRes.ok) {
          this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: entityRes.message || `Error al cargar ${tab.label}`, life: 8000 })
          continue
        }
        const key = Object.keys(entityRes.data)[0]
        schemas[tab.model] = toDynamicFormSchema(entityRes.data[key], tab.model)
      }
      this.schemas.set(schemas)
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al inicializar el componente', life: 8000 })
    }
    this.loading.set(false)
  }

  protected nextStep(i: number): void {
    if (i >= this.tabs().length - 1) {
      this.saveDataSteppers()
    } else {
      this.stepIndex.set(i + 1)
    }
  }

  protected isLastStep(i: number): boolean {
    return i >= this.tabs().length - 1
  }

  protected handleClose(): void {
    this.closed.emit()
  }

  protected async saveModel(model: string): Promise<void> {
    const form = this.formFor(model)
    if (!form || !form.validate()) {
      this.toast.add({ severity: 'warn', summary: 'Validación', detail: 'Complete todos los campos obligatorios', life: 6000 })
      return
    }

    this.saving.set(true)
    try {
      const body = this.buildBody(model)
      const res = await firstValueFrom(this.api.save(this.dominio, model, body))
      if (!res.ok) {
        this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: res.message || `Error al guardar ${model}`, life: 8000 })
        return
      }
      this.toast.add({ severity: 'success', summary: 'Éxito', detail: res.message || 'Datos guardados correctamente', life: 5000 })
      this.saved.emit(res.data)
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: `Error al guardar ${model}`, life: 8000 })
    }
    this.saving.set(false)
  }

  protected async saveDataSteppers(): Promise<void> {
    for (const tab of this.tabs()) {
      const form = this.formFor(tab.model)
      if (!form || !form.validate()) {
        this.toast.add({ severity: 'warn', summary: 'Validación', detail: 'Complete todos los campos obligatorios', life: 6000 })
        return
      }
    }

    this.saving.set(true)
    try {
      for (const tab of this.tabs()) {
        const body = this.buildBody(tab.model)
        const res = await firstValueFrom(this.api.save(this.dominio, tab.model, body))
        if (!res.ok) {
          this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: res.message || `Error al guardar ${tab.label}`, life: 8000 })
          return
        }
      }
      this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente', life: 5000 })
      this.saved.emit()
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar datos', life: 8000 })
    }
    this.saving.set(false)
  }

  protected iconClass(icon: string): string {
    const map: Record<string, string> = {
      'mdi-folder-outline': 'pi pi-folder',
      'mdi-cog-outline': 'pi pi-cog',
    }
    return map[icon] || icon
  }

  private formFor(model: string): DynamicForm | undefined {
    const idx = this.tabs().findIndex(t => t.model === model)
    return this.formEls?.get(idx)
  }

  private buildBody(model: string): Record<string, unknown> {
    const values = this.formFor(model)?.getFormValues()?.['datos'] ?? {}
    return { idx: this.idxSelected, ...values }
  }
}
