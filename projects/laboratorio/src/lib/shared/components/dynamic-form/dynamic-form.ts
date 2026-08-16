import { KeyValuePipe } from '@angular/common'
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms'
import { CardModule } from 'primeng/card'

import { DynamicField } from './dynamic-field'
import { DynamicFieldConfig, DynamicFormSchema } from './dynamic-form.models'

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Component({
  selector: 'lab-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, CardModule, DynamicField],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
})
export class DynamicForm implements OnInit, OnChanges {
  @Input() schema!: DynamicFormSchema
  @Input() lengthCols = 3
  @Input() forEdit = false
  @Output() schemaChange = new EventEmitter<DynamicFormSchema>()

  formGroups: Record<string, FormGroup> = {}

  private fb = inject(FormBuilder)

  ngOnInit(): void {
    this.buildForm()
  }

  preserveOrder(): number {
    return 0
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && !changes['schema'].firstChange) {
      this.buildForm()
    }
  }

  getGroup(sectionKey: string): FormGroup {
    return this.formGroups[sectionKey]
  }

  getFormValues(): Record<string, Record<string, unknown>> {
    const result: Record<string, Record<string, unknown>> = {}
    for (const [key, group] of Object.entries(this.formGroups)) {
      result[key] = { ...group.value } as Record<string, unknown>
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
      const groupConfig: Record<string, unknown> = {}
      for (const [fieldName, config] of Object.entries(section.campos)) {
        const rawValue = section.valores?.[fieldName] ?? null
        let simpleValue = this.extractSimpleValue(rawValue)
        const validators = this.buildValidators(config)
        if ((config.typeCode === 'HH' || config.typeCode === 'HV') && config.multiple && !Array.isArray(simpleValue)) {
          simpleValue = simpleValue == null ? [] : [simpleValue]
        }
        groupConfig[fieldName] = [simpleValue, validators]
      }
      this.formGroups[sectionKey] = this.fb.group(groupConfig)
    }
  }

  private extractSimpleValue(value: unknown): unknown {
    if (value === null || value === undefined) return null
    if (typeof value !== 'object') return value
    const obj = value as Record<string, unknown>
    const selected = obj['selected']
    if (Array.isArray(selected)) {
      return selected.map(item => {
        if (item !== null && typeof item === 'object' && 'value' in (item as Record<string, unknown>)) {
          return (item as Record<string, unknown>)['value']
        }
        return item
      })
    }
    if (selected !== null && typeof selected === 'object' && 'value' in (selected as Record<string, unknown>)) {
      return (selected as Record<string, unknown>)['value']
    }
    if ('value' in obj) return obj['value']
    return value
  }

  private buildValidators(config: DynamicFieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = []
    if (config.required) {
      if (config.typeCode === 'HH' || config.typeCode === 'HV') {
        validators.push(this.atLeastOneSelected())
      } else {
        validators.push(Validators.required)
      }
    }
    if (config.maxLength) validators.push(Validators.maxLength(config.maxLength))
    if (config.typeCode === 'TM') validators.push(Validators.pattern(EMAIL_PATTERN))
    return validators
  }

  private atLeastOneSelected(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value
      if (Array.isArray(value)) return value.length > 0 ? null : { required: true }
      return value ? null : { required: true }
    }
  }
}
