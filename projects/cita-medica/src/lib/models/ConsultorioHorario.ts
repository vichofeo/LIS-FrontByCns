import { Horario } from './Horario'
import { Usuario } from './Usuario'

export interface ConsultorioHorario {
  id: number
  consultorioId: number
  centroMedicoId: number
  horarioId: number
  fechaInicio: Date
  fechaFin?: Date
  estado: boolean
  observacion: string
  consultorio: string
  cantidadReconsultas: number
  medicoUsuarioId: string
  reconsultaValida: boolean
  diasAtencion: number[]
  horario: Horario
  medicoUsuario: Usuario
}
