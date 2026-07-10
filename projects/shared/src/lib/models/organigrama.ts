export interface Organigrama {
  organigramaId: number
  descripcion: string
  organigramaPadreId: number
  nivelId: number
  codigo: number
  codigoPrograma: string
  codigoUbicacion: string
  codigoOrganigrama: string
  codigoContable: string
  ubicacionId: number
}

export interface OrganigramaRegionalDistrital {
  organigramaId: number
  descripcion: string
  codigoOrganigrama: string
  ubicacionId: string
  nivelId: string
  value: string
  detail: string
}

export interface OrganigramaJerarquia {
  organigramaRegionalId: number
  descripcionRegional: string
  organigramaOficinaId: 0
  descripcionOficina: string
  organigramaEstablecimientoId: 0
  descripcionEstablecimiento: string
  organigramaServicioId: 0
  descripcionServicio: string
  nivelId: 0
  codigo: 0
  codigoPrograma: string
  codigoUbicacion: string
  codigoOrganigrama: string
  codigoContable: string
  ubicacionId: 0
}
