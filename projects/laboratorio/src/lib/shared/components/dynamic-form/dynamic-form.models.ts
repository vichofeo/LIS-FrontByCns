export type FieldTypeCode =
  | 'TT' | 'TN' | 'TD' | 'TM' | 'TP'
  | 'TA' | 'TAR'
  | 'F' | 'FT' | 'FC'
  | 'C'
  | 'RH' | 'RV'
  | 'HH' | 'HV'
  | 'FA' | 'FI'
  | 'SW'
  | 'MS'
  | 'MH'
  | 'YT'
  | 'H';

export interface DynamicFieldConfig {
  label: string;
  editable: boolean;
  required: boolean;
  typeCode: FieldTypeCode;
  maxLength?: number;
  forcePlain?: boolean;
}

export interface DynamicFormSection {
  label?: string;
  linked?: string;
  model?: string;
  campos: Record<string, DynamicFieldConfig>;
  valores: Record<string, any>;
}

export interface DynamicFormSchema {
  [sectionKey: string]: DynamicFormSection;
}
