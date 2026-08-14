import { DynamicEntityData, DynamicFormCampos } from '../models/dynamic-api.models'
import { DynamicFieldConfig, DynamicFormSchema, FieldTypeCode } from '../components/dynamic-form/dynamic-form.models'

interface CamposItem { value: string; text: string }

export function toDynamicFormSchema(entity: DynamicEntityData, model: string): DynamicFormSchema {
  const campos = entity.campos
  const valores = (entity.valores as Record<string, any>) || {}
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
