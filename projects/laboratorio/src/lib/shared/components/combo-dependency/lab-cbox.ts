import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { MultiSelectModule } from 'primeng/multiselect'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { SelectModule } from 'primeng/select'
import { ToastModule } from 'primeng/toast'
import { firstValueFrom } from 'rxjs'

import { DynamicCboxField, DynamicCboxResponse } from '../../models/dynamic-api.models'
import { DynamicApiService } from '../../services/dynamic-api.service'

@Component({
  selector: 'lab-cbox',
  standalone: true,
  providers: [MessageService],
  imports: [ReactiveFormsModule, SelectModule, MultiSelectModule, ProgressSpinnerModule, ToastModule],
  templateUrl: './lab-cbox.html',
  styleUrl: './lab-cbox.scss',
})
export class LabCbox implements OnInit {
  @Input({ required: true }) dominio!: string
  @Input({ required: true }) modelo!: string
  @Input() datosIn: Record<string, unknown> = {}
  @Input() limite = 100
  @Input() colsWidth = 6
  @Input() disabled = false

  @Output() cboxChange = new EventEmitter<Record<string, unknown>>()

  protected formGroup!: FormGroup
  protected campos = signal<Record<string, unknown[]>>({})
  protected valores = signal<Record<string, DynamicCboxField>>({})
  protected loading = signal(false)

  private fb = inject(FormBuilder)
  private api = inject(DynamicApiService)
  private toast = inject(MessageService)

  get campoEntries(): { key: string; config: unknown[] }[] {
    return Object.entries(this.campos())
      .slice(0, this.limite)
      .map(([key, config]) => ({ key, config }))
  }

  ngOnInit(): void {
    void this.loadCbox(this.datosIn)
  }

  protected isMultiple(field: string): boolean {
    return this.campos()[field]?.[6] === 'M'
  }

  protected options(field: string): { value: string; text: string }[] {
    return this.valores()[field]?.items ?? []
  }

  protected async onComboChange(): Promise<void> {
    const selected = this.collectSelected()
    await this.loadCbox(selected)
    this.cboxChange.emit(this.collectSelected())
  }

  private async loadCbox(selected: Record<string, unknown>): Promise<void> {
    this.loading.set(true)
    try {
      const res = await firstValueFrom(this.api.cbox(this.dominio, this.modelo, selected))
      if (res.ok && res.data) {
        this.apply(res)
      } else {
        this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: res.message, life: 6000 })
      }
    } catch {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los combos dependientes', life: 8000 })
    }
    this.loading.set(false)
  }

  private apply(res: DynamicCboxResponse): void {
    this.campos.set(res.data.campos ?? {})
    this.valores.set(res.data.valores ?? {})
    this.buildForm()
  }

  private buildForm(): void {
    const group: Record<string, unknown> = {}
    for (const [field, config] of Object.entries(this.campos())) {
      group[field] = this.extractSelected(this.valores()[field], config)
    }
    this.formGroup = this.fb.group(group)
  }

  private extractSelected(fieldVal: DynamicCboxField | undefined, config: unknown[]): unknown {
    const selected = fieldVal?.selected
    if (Array.isArray(selected)) return selected.map(s => s.value)
    if (selected) return selected.value
    return config[6] === 'M' ? [] : null
  }

  private collectSelected(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const field of Object.keys(this.campos())) {
      const value = this.formGroup?.get(field)?.value
      if (value == null || value === '') continue
      result[field] = value
    }
    return result
  }
}
