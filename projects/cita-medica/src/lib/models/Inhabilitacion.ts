import { ConsultorioHorario } from './ConsultorioHorario'

export interface Inhabilitacion {
  id: number
  consultorioHorarioId?: number
  descripcion: string
  fechaInicio: string
  fechaFin: string
  horaInicio: string // Puedes utilizar string o Date, dependiendo de cómo manejes TimeSpan en TS
  horaFin: string // Lo mismo aquí
  estado: boolean
  consultorioHorario?: ConsultorioHorario
  horaInicioDetalle: string
  horaFinDetalle: string
  horarioCompleto: boolean
  allCentros: boolean
  idsCentroMedico?: number[]
  allMedicos: boolean
  idsMedicoUsuario: string[]
  excepcionMedicoUsuario: string[]
}

export interface DataResponse {
  hasItems: boolean
  items: Inhabilitacion[]
  total: number
  page: number
  pages: number
}
