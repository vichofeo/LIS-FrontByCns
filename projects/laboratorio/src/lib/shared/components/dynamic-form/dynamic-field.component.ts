import { Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { InputNumberModule } from 'primeng/inputnumber'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { DatePickerModule } from 'primeng/datepicker'
import { RadioButtonModule } from 'primeng/radiobutton'
import { CheckboxModule } from 'primeng/checkbox'
import { ToggleSwitchModule } from 'primeng/toggleswitch'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { MultiSelectModule } from 'primeng/multiselect'
import { FileUploadModule } from 'primeng/fileupload'
import { DynamicFieldConfig } from './dynamic-form.models'

@Component({
  selector: 'lab-dynamic-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule, InputNumberModule, TextareaModule,
    SelectModule, DatePickerModule, RadioButtonModule,
    CheckboxModule, ToggleSwitchModule, AutoCompleteModule,
    MultiSelectModule, FileUploadModule,
  ],
  template: `
    @if (config.typeCode === 'YT') {
      <div [formGroup]="formGroup" class="col-12" [style]="{ display: 'none' }">
        <input pInputText [formControlName]="fieldName" />
      </div>
    } @else {
      <div [formGroup]="formGroup" [style.grid-column]="'span ' + colSpan">
        @if (config.typeCode === 'H') {
          <div [style]="{ display: 'none' }">
            <input pInputText [formControlName]="fieldName" />
          </div>
        } @else if (config.forcePlain || !config.editable) {
          <div class="field">
            <label [for]="fieldId">{{ config.label }}</label>
            <input pInputText [id]="fieldId" [formControlName]="fieldName" readonly [value]="plainText" />
          </div>
        } @else {
          @switch (config.typeCode) {
            @case ('TT') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <input pInputText [id]="fieldId" [formControlName]="fieldName" />
              </div>
            }
            @case ('TN') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <p-inputNumber [id]="fieldId" [formControlName]="fieldName" [minFractionDigits]="0" [maxFractionDigits]="0" />
              </div>
            }
            @case ('TD') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <p-inputNumber [id]="fieldId" [formControlName]="fieldName" [minFractionDigits]="2" [maxFractionDigits]="6" />
              </div>
            }
            @case ('TM') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <input pInputText [id]="fieldId" [formControlName]="fieldName" type="email" />
              </div>
            }
            @case ('TP') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}</label>
                <input pInputText [id]="fieldId" [formControlName]="fieldName" readonly />
              </div>
            }
            @case ('TA') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <textarea pTextarea [id]="fieldId" [formControlName]="fieldName" [rows]="3" [maxlength]="config.maxLength || 512"></textarea>
              </div>
            }
            @case ('TAR') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <textarea pTextarea [id]="fieldId" [formControlName]="fieldName" [rows]="3" [maxlength]="config.maxLength || 512"></textarea>
              </div>
            }
            @case ('C') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <p-select [id]="fieldId" [formControlName]="fieldName" [options]="comboOptions" optionLabel="label" optionValue="value" [showClear]="true" [style]="{ width: '100%' }"></p-select>
              </div>
            }
            @case ('F') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <p-datepicker [id]="fieldId" [formControlName]="fieldName" [showIcon]="true" [iconDisplay]="'input'" [showClear]="true" dateFormat="dd/mm/yy"></p-datepicker>
              </div>
            }
            @case ('FT') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <p-datepicker [id]="fieldId" [formControlName]="fieldName" [showIcon]="true" [iconDisplay]="'input'" [showClear]="true" dateFormat="dd/mm/yy"></p-datepicker>
              </div>
            }
            @case ('FC') {
              <div class="field">
                <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                <p-datepicker [id]="fieldId" [formControlName]="fieldName" [showIcon]="true" [iconDisplay]="'input'" [showClear]="true" dateFormat="dd/mm/yy"></p-datepicker>
              </div>
            }
              @case ('RH') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <div class="flex flex-wrap gap-3">
                    @for (opt of radioOptions; track opt.value) {
                      <div class="flex align-items-center">
                        <p-radioButton [inputId]="fieldId + '_' + $index" [value]="opt.value" [formControlName]="fieldName" />
                        <label [for]="fieldId + '_' + $index" class="ml-1">{{ opt.label }}</label>
                      </div>
                    }
                  </div>
                </div>
              }
              @case ('RV') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <div class="flex flex-column gap-2">
                    @for (opt of radioOptions; track opt.value) {
                      <div class="flex align-items-center">
                        <p-radioButton [inputId]="fieldId + '_' + $index" [value]="opt.value" [formControlName]="fieldName" />
                        <label [for]="fieldId + '_' + $index" class="ml-1">{{ opt.label }}</label>
                      </div>
                    }
                  </div>
                </div>
              }
              @case ('HH') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <div class="flex flex-wrap gap-3">
                    @for (opt of checkboxOptions; track opt.value) {
                      <div class="flex align-items-center">
                        <p-checkbox [inputId]="fieldId + '_' + $index" [value]="opt.value" [formControlName]="fieldName" />
                        <label [for]="fieldId + '_' + $index" class="ml-1">{{ opt.label }}</label>
                      </div>
                    }
                  </div>
                </div>
              }
              @case ('HV') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <div class="flex flex-column gap-2">
                    @for (opt of checkboxOptions; track opt.value) {
                      <div class="flex align-items-center">
                        <p-checkbox [inputId]="fieldId + '_' + $index" [value]="opt.value" [formControlName]="fieldName" />
                        <label [for]="fieldId + '_' + $index" class="ml-1">{{ opt.label }}</label>
                      </div>
                    }
                  </div>
                </div>
              }
              @case ('SW') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <p-toggleswitch [formControlName]="fieldName" />
                </div>
              }
              @case ('MS') {
                <div class="field">
                  <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <p-autoComplete [id]="fieldId" [formControlName]="fieldName" [suggestions]="filteredOptions" (completeMethod)="onFilter($event)" optionLabel="label" [dropdown]="true" [style]="{ width: '100%' }"></p-autoComplete>
                </div>
              }
              @case ('MH') {
                <div class="field">
                  <label [for]="fieldId">{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <p-multiSelect [id]="fieldId" [formControlName]="fieldName" [options]="comboOptions" optionLabel="label" [showClear]="true" [style]="{ width: '100%' }"></p-multiSelect>
                </div>
              }
              @case ('FA') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <p-fileUpload [url]="''" [auto]="false" chooseLabel="Elegir"></p-fileUpload>
                </div>
              }
              @case ('FI') {
                <div class="field">
                  <label>{{ config.label }}@if (config.required) { <span class="text-red-500">*</span> }</label>
                  <p-fileUpload [url]="''" [auto]="false" chooseLabel="Elegir" accept="image/*"></p-fileUpload>
                </div>
              }
            }
          }
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .field { display: flex; flex-direction: column; margin-bottom: 1rem; }
    .field > label { margin-bottom: 0.35rem; font-weight: 500; font-size: 0.875rem; }
    .text-red-500 { color: #ef4444; }
  `],
})
export class DynamicFieldComponent {
  private static idCounter = 0

  @Input({ required: true }) formGroup!: FormGroup
  @Input({ required: true }) fieldName!: string
  @Input({ required: true }) config!: DynamicFieldConfig
  @Input() valores: Record<string, any> = {}
  @Input() colSpan = 3

  protected fieldId = `lab-field-${++DynamicFieldComponent.idCounter}`
  protected filteredOptions: any[] = []

  get plainText(): string {
    return this.config.label || ''
  }

  get comboOptions(): { value: unknown; label: string }[] {
    const fieldVal = this.valores?.[this.fieldName]
    if (fieldVal?.items && Array.isArray(fieldVal.items)) {
      return fieldVal.items.map((item: any) => ({
        value: item.value ?? item,
        label: item.text ?? item.label ?? String(item),
      }))
    }
    return []
  }

  get radioOptions(): { value: unknown; label: string }[] {
    return this.comboOptions
  }

  get checkboxOptions(): { value: unknown; label: string }[] {
    return this.comboOptions
  }

  protected onFilter(event: { query: string }): void {
    const query = event.query.toLowerCase()
    const opts = this.comboOptions
    this.filteredOptions = opts.filter(o => o.label.toLowerCase().includes(query))
  }
}
