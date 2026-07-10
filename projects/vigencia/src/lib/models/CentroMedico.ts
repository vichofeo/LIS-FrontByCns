export interface CentroMedico {
  id: number
  tipoCentroMedicoId?: number
  ubicacionRegionalId?: number
  ubicacionId?: number
  descripcion: string
  abreviatura?: string
  estado?: number
  latitud?: number
  longitud?: number
  direccion?: string
  codigo?: string
  numeroCentro?: number
  nivelAtencionId?: number
  eliminacionReservas?: boolean
}
