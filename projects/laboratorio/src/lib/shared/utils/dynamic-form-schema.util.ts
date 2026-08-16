import { DynamicFieldConfig, DynamicFormSchema, FieldTypeCode } from '../components/dynamic-form/dynamic-form.models'
import { DynamicEntityData, DynamicFormCampos } from '../models/dynamic-api.models'

interface CamposItem { value: string; text: string }

export function toDynamicFormSchema(entity: DynamicEntityData, model: string): DynamicFormSchema {
  const campos = entity.campos
  const valores: Record<string, unknown> = Array.isArray(entity.valores) ? {} : entity.valores
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
        forcePlain: !!campo[5],
        multiple: campo[6] === 'M',
        rows: typeof campo[6] === 'number' ? campo[6] : undefined,
        sinInicial: !!campo[7],
      }
    }
  }

  return {
    datos: {
      label: 'Datos',
      linked: entity.linked,
      model,
      campos: sectionCampos,
      valores,
    },
  }
}
