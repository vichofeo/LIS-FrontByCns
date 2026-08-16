import { Component, Input, OnInit, signal } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { ChipModule } from 'primeng/chip'
import { DatePickerModule } from 'primeng/datepicker'
import { FileUploadModule } from 'primeng/fileupload'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { RadioButtonModule } from 'primeng/radiobutton'
import { SelectModule } from 'primeng/select'
import { TextareaModule } from 'primeng/textarea'
import { ToggleSwitchModule } from 'primeng/toggleswitch'

import { DynamicFieldConfig } from './dynamic-form.models'
import { DynamicFieldCombo } from '../../models/dynamic-api.models'

@Component({
  selector: 'lab-dynamic-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule, InputNumberModule, TextareaModule,
    SelectModule, DatePickerModule, RadioButtonModule,
    CheckboxModule, ToggleSwitchModule, AutoCompleteModule,
    ChipModule, FileUploadModule, ButtonModule,
  ],
  templateUrl: './dynamic-field.html',
  styleUrl: './dynamic-field.scss',
})
export class DynamicField implements OnInit {
  private static idCounter = 0

  @Input({ required: true }) formGroup!: FormGroup
  @Input({ required: true }) fieldName!: string
  @Input({ required: true }) config!: DynamicFieldConfig
  @Input() valores: Record<string, unknown> = {}
  @Input() colSpan = 3

  protected fieldId = `lab-field-${++DynamicField.idCounter}`
  protected filteredOptions: { value: string; label: string }[] = []
  protected limit = 7
  protected tope = 7
  protected previewUrl = signal<string | null>(null)

  get plainText(): string {
    return this.config.label || ''
  }

  get switchValue(): string {
    return String(this.formGroup.get(this.fieldName)?.value ?? '')
  }

  get minDate(): Date | null {
    switch (this.config.typeCode) {
      case 'FT': return this.shiftDays(new Date(), -30)
      case 'F': case 'FC': return new Date(1930, 0, 1)
      default: return null
    }
  }

  get maxDate(): Date | null {
    return this.config.typeCode === 'F' ? new Date() : null
  }

  get comboOptions(): { value: string; label: string }[] {
    const fieldVal = this.valores[this.fieldName] as DynamicFieldCombo | undefined
    if (fieldVal?.items && Array.isArray(fieldVal.items)) {
      return fieldVal.items.map(item => ({ value: item.value, label: item.text }))
    }
    return []
  }

  get radioOptions(): { value: unknown; label: string }[] {
    return this.comboOptions
  }

  get checkboxOptions(): { value: unknown; label: string }[] {
    return this.comboOptions
  }

  get chips(): string[] {
    const v = this.formGroup.get(this.fieldName)?.value
    if (Array.isArray(v)) return v.map(String)
    if (typeof v === 'string' && v.trim()) return v.split(',').map(s => s.trim()).filter(Boolean)
    return []
  }

  ngOnInit(): void {
    const v = this.formGroup.get(this.fieldName)?.value
    if (typeof v === 'string' && v.startsWith('data:')) {
      this.previewUrl.set(v)
    }
  }

  protected onFilter(event: { query: string }): void {
    const query = event.query.toLowerCase()
    const opts = this.comboOptions
    this.filteredOptions = opts.filter(o => o.label.toLowerCase().includes(query))
  }

  protected showMore(): void {
    this.limit = this.checkboxOptions.length + 1
  }

  protected showLess(): void {
    this.limit = this.tope
  }

  protected addChip(event: Event): void {
    const input = event.target as HTMLInputElement
    const items = input.value.split(',').map(s => s.trim()).filter(Boolean)
    if (!items.length) return
    this.formGroup.get(this.fieldName)?.setValue([...this.chips, ...items].join(','))
    input.value = ''
  }

  protected removeChip(index: number): void {
    const next = [...this.chips]
    next.splice(index, 1)
    this.formGroup.get(this.fieldName)?.setValue(next.join(','))
  }

  protected onFileSelect(event: { files: File[] }): void {
    const file = event?.files?.[0]
    if (!file) return
    this.toBase64(file)
      .then(base64 => {
        this.previewUrl.set(base64)
        this.formGroup.get(this.fieldName)?.setValue(base64)
      })
      .catch(() => this.previewUrl.set(null))
  }

  protected clearFile(): void {
    this.previewUrl.set(null)
    this.formGroup.get(this.fieldName)?.setValue(null)
  }

  private shiftDays(base: Date, days: number): Date {
    const d = new Date(base)
    d.setDate(d.getDate() + days)
    return d
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }
}
