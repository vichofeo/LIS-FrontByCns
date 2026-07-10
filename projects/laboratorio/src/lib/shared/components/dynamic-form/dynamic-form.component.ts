import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { KeyValuePipe } from '@angular/common'
import { CardModule } from 'primeng/card'
import { DynamicFormSchema } from './dynamic-form.models'
import { DynamicFieldComponent } from './dynamic-field.component'

@Component({
  selector: 'lab-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, CardModule, DynamicFieldComponent],
  template: `
    @for (section of schema | keyvalue: preserveOrder; track section.key) {
      <p-card [style]="{ marginBottom: '1rem' }">
        <ng-template pTemplate="title">
          {{ section.value.label || section.key }}
        </ng-template>
        <ng-template pTemplate="content">
          <div class="grid">
            @for (campo of section.value.campos | keyvalue: preserveOrder; track campo.key) {
              <lab-dynamic-field
                [formGroup]="getGroup(section.key)"
                [fieldName]="campo.key"
                [config]="campo.value"
                [valores]="section.value.valores"
                [colSpan]="campo.value.typeCode === 'H' ? 12 : (lengthCols || 3)"
              />
            }
          </div>
        </ng-template>
      </p-card>
    }
  `,
  styles: [`
    :host { display: block; }
    .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0.75rem; }
    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
    }
  `],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() schema!: DynamicFormSchema
  @Input() lengthCols = 3
  @Input() forEdit = false
  @Output() schemaChange = new EventEmitter<DynamicFormSchema>()

  formGroups: Record<string, FormGroup> = {}

  preserveOrder = (): number => 0

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && !changes['schema'].firstChange) {
      this.buildForm()
    }
  }

  getGroup(sectionKey: string): FormGroup {
    return this.formGroups[sectionKey]
  }

  getFormValues(): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [key, group] of Object.entries(this.formGroups)) {
      result[key] = { ...group.value }
    }
    return result
  }

  validate(): boolean {
    let valid = true
    for (const group of Object.values(this.formGroups)) {
      if (group.invalid) {
        Object.values(group.controls).forEach(c => c.markAsTouched())
        valid = false
      }
    }
    return valid
  }

  private buildForm(): void {
    this.formGroups = {}
    if (!this.schema) return

    for (const [sectionKey, section] of Object.entries(this.schema)) {
      const groupConfig: Record<string, any> = {}
      for (const [fieldName, config] of Object.entries(section.campos)) {
        const rawValue = section.valores?.[fieldName] ?? null
        const simpleValue = this.extractSimpleValue(rawValue)
        const validators = this.buildValidators(config)
        groupConfig[fieldName] = [simpleValue, validators]
      }
      this.formGroups[sectionKey] = this.fb.group(groupConfig)
    }
  }

  private extractSimpleValue(value: any): any {
    if (value === null || value === undefined) return null
    if (typeof value !== 'object') return value
    if (value.selected?.value !== undefined) return value.selected.value
    if (value.value !== undefined) return value.value
    return value
  }

  private buildValidators(config: any): any[] {
    const validators: any[] = []
    if (config.required) validators.push(Validators.required)
    if (config.maxLength) validators.push(Validators.maxLength(config.maxLength))
    return validators
  }
}
