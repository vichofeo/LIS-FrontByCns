export interface Horario {
  id: number
  descripcion: string
  estado: boolean
  intervalo: number
  horaInicio: string // Puede ser manejado como `string` o `Date` dependiendo de cómo manejes TimeSpan en TS
  horaFin: string // Lo mismo aquí
  horaInicioDetalle: string
  horaFinDetalle: string
  numeroFichas: number
  numeroFichasAdicionales: number
}
