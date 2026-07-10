import { CentroMedico } from 'vigencia'

export interface Usuario {
  id: string
  userName: string
  phoneNumber: string
  email: string
  nombres: string
  numeroDocumento: string
  fechaNacimiento: Date
  centroMedicoId: number | null
  centroMedico: CentroMedico | null
  key: unknown
}
