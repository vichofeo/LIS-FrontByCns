import { CentroMedico } from 'vigencia'

import { Parametrica } from './Parametrica'

export interface Consultorio {
  id: number
  abreviatura: string
  descripcion: string
  estado: boolean
  centroMedicoId: number
  tipoConsultorioId: number
  tipoEspecialidadId: number
  tipoConsultorio: Parametrica
  tipoEspecialidad: Parametrica
  centroMedico?: CentroMedico
}
