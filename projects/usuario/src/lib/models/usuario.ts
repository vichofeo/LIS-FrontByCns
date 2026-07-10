export interface Usuario {
  id: number
  matricula: string
  empleadoId: number
  primerApellido: string
  segundoApellido: string
  nombres: string
  numeroDocumento: string
  extencion: string
  profesionOcupacion: string
  correoElectronico: string
  celulares: string
  telefonos: string
  fechaNacimiento: string
  genero: string
  zona: string
  direccion: string
  imagenId: number
  skype: string
  isValidado: boolean
}

export interface DatosEmpleo {
  id: number
  nroContrato: string
  fechaInicio: string
  fechaFin: string
  estado: string
  regionalesDescripcion: string
  oficinasDescripcion: string
  divisionesDescripcion: string
  seccionesDescripcion: string
  unidadesDescripcion: string
  tipoContrato: string
  areaTrabajo: string
  tipoEmpleadoId: number
}
export interface Gestion {
  gestion: number
}
export interface Mes {
  code: string
  nombre: string
}

export interface TarjetaDetalle {
  nro: number
  dia: string
  diaCompleto: string
  entradaM?: string
  salidaM?: string
  entradaT?: string
  salidaT?: string
  fecha: string
  tipoTarjeta: number
  minAtraso1?: number
  minAtraso2?: number
  marcacionExcepcion?: string | string[] | null
  permisos?: Permiso[]
  fechaformato?: string
}

export interface Tarjeta {
  abandonoIngreso: number
  abandonoSalida: number
  faltasDiaCompleto: number
  nombreHorario: string
  nroDiaTrabajar: number
  restanteMinutos: number
  retrasoMinutos: number
  tarjeta: TarjetaDetalle[]
  toleranciaMinutos: number
  totalFaltas: number
}

export interface Permiso {
  titulo: string
  observacion: string
  tipo: 'success' | 'info' | 'warn' | 'danger'
}

export interface DataResponse {
  hasItems: boolean
  items: Usuario[]
  total: number
  page: number
  pages: number
}
