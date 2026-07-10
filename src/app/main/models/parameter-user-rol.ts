export interface ParametroValor {
  valor: string
}

export interface ParametroData {
  nombre: string
  descripcion: string
  valores: ParametroValor[]
}

export interface NombreTotal {
  nombre: string
}

export interface ParameterUserRol {
  data: ParametroData[]
  nombresTotales: NombreTotal[]
  tieneParametrosPendientes: boolean
}
