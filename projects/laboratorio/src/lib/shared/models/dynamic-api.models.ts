export interface DynamicFieldCombo {
  s01: { value: unknown }
  selected: { value: string; text: string }
  items: DynamicSelectItem[]
  dependency: boolean
}

export interface DynamicSelectItem {
  value: string
  text: string
}

export type DynamicFieldValue = string | number | boolean | null | DynamicFieldCombo

export type DynamicFormValues = Record<string, DynamicFieldValue>;

export type DynamicFormCampos = Record<string, [string, boolean, boolean, string, number?, unknown?, unknown?, unknown?]>;

export interface DynamicListItem {
  idx: string
  linked?: string
  [field: string]: unknown
}

export interface DynamicListCampos {
  value: string
  text: string
}

export interface DynamicEntityData {
  campos: DynamicFormCampos | DynamicListCampos[]
  valores: DynamicFormValues | DynamicListItem[]
  exito?: boolean
  linked?: string
}

export interface DynamicGroup {
  model: string
  label: string
  icon: string
}

export interface DynamicAgrupadoResponse {
  ok: boolean
  data: DynamicGroup[]
  message: string
}

export interface DynamicResponse {
  ok: boolean
  data: Record<string, DynamicEntityData>
  message: string
}

export interface DynamicCboxField {
  selected: DynamicSelectItem | DynamicSelectItem[]
  items: DynamicSelectItem[]
}

export interface DynamicCboxData {
  campos?: Record<string, unknown[]>
  valores?: Record<string, DynamicCboxField>
  dataTable?: unknown
  headers?: unknown
}

export interface DynamicCboxResponse {
  ok: boolean
  data: DynamicCboxData
  message: string
}
