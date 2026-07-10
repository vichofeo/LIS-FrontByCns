export interface Medico {
  id: string
  userName: string
  nombres: string
  numeroDocumento: string
  fechaNacimiento: Date
  centroMedicoId: number
  reservas: Reserva[]
  //aditional
  consultorioSelected: number
  reservasFiltradas: Reserva[]
  consultorios: Consultorio[]
}

export interface Reserva {
  numero: number
  inicio: string
  fechaReserva: Date
  asegurado: string
  documentoIdentidad: string
  fechaNacimiento: Date
  estadoReservaId: number
  consultorioId: number
  tipoReserva: number
}

export interface Consultorio {
  id: number
  descripcion: string
}
