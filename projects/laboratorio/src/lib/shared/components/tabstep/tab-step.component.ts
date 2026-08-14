import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren, computed, inject, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { MenuItem, MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { StepsModule } from 'primeng/steps'
import { TabsModule } from 'primeng/tabs'
import { ToastModule } from 'primeng/toast'
import { firstValueFrom } from 'rxjs'

import { DynamicApiService } from '../../services/dynamic-api.service'
import { toDynamicFormSchema } from '../../utils/dynamic-form-schema.util'
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component'
import { DynamicFormSchema } from '../dynamic-form/dynamic-form.models'
import { TabStepGroupItem } from './tabstep.models'

@Component({
  selector: 'lab-tab-step',
  standalone: true,
  providers: [MessageService],
  imports: [CardModule, ButtonModule, ProgressSpinnerModule, TabsModule, StepsModule, ToastModule, DynamicFormComponent],
  template: `
    <p-toast />

    @if (loading()) {
      <div class="flex justify-content-center p-4">
        <p-progressSpinner />
      </div>
    } @else {
      @if (!swStepper) {
        <p-tabs [(value)]="activeIndex">
          <p-tablist>
            @for (tab of tabs(); track tab.model; let i = $index) {
              <p-tab [value]="i">
                <i [class]="iconClass(tab.icon)"></i> {{ tab.label }}
              </p-tab>
            }
          </p-tablist>
          <p-tabpanels>
            @for (tab of tabs(); track tab.model; let i = $index) {
              <p-tabpanel [value]="i">
                <p-card>
                  <ng-template pTemplate="content">
                    @if (schemas()[tab.model]) {
                      <lab-dynamic-form #dynForm [schema]="schemas()[tab.model]!" [lengthCols]="lengthCols" />
                    } @else {
                      <div class="flex justify-content-center p-4">
                        <p-progressSpinner />
                      </div>
                    }
                  </ng-template>
                </p-card>
                <div class="flex justify-content-end gap-2 mt-3">
                  <p-button label="Cancelar" severity="secondary" (onClick)="handleClose()" />
                  <p-button label="Guardar" [loading]="saving()" (onClick)="saveModel(tab.model)" />
                </div>
              </p-tabpanel>
            }
          </p-tabpanels>
        </p-tabs>
      } @else {
        <p-steps [model]="stepsModel()" [(activeIndex)]="stepIndex" [readonly]="false" />
        @for (tab of tabs(); track tab.model; let i = $index) {
          <div [hidden]="stepIndex() !== i">
            <p-card [style]="{ marginTop: '1rem' }">
              <ng-template pTemplate="content">
                @if (schemas()[tab.model]) {
                  <lab-dynamic-form #dynForm [schema]="schemas()[tab.model]!" [lengthCols]="lengthCols" />
                } @else {
                  <div class="flex justify-content-center p-4">
                    <p-progressSpinner />
                  </div>
                }
              </ng-template>
            </p-card>
            <div class="flex justify-content-end gap-2 mt-3">
              <p-button label="Cancelar" severity="secondary" (onClick)="handleClose()" />
              <p-button
                [label]="isLastStep(i) ? 'Guardar' : 'Continuar'"
                [loading]="saving()"
                (onClick)="nextStep(i)"
              />
            </div>
          </div>
        }
      }
    }
  `,
})
export class TabStepComponent implements OnInit {
  @Input({ required: true }) modelGroup!: string
  @Input() dominio = 'areas'
  @Input() idxSelected: string | null = null
  @Input() swStepper = false
  @Input() lengthCols = 6

  @Output() saved = new EventEmitter<unknown>()
  @Output() close = new EventEmitter<void>()

  @ViewChildren('dynForm') private formEls!: QueryList<DynamicFormComponent>

  private api = inject(DynamicApiService)
  private toast = inject(MessageService)

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
    this.close.emit()
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

  private formFor(model: string): DynamicFormComponent | undefined {
    const idx = this.tabs().findIndex(t => t.model === model)
    return this.formEls?.get(idx)
  }

  private buildBody(model: string): Record<string, unknown> {
    const values = this.formFor(model)?.getFormValues()?.['datos'] ?? {}
    return { idx: this.idxSelected, ...values }
  }

  protected iconClass(icon: string): string {
    const map: Record<string, string> = {
      'mdi-folder-outline': 'pi pi-folder',
      'mdi-cog-outline': 'pi pi-cog',
    }
    return map[icon] || icon
  }
}
