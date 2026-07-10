export interface PermisoValor {
  valor: string;
}

export interface Permiso {
  nombre: string;
  descripcion: string;
  valores: PermisoValor[];
}

export interface NombreTotal {
  nombre: string;
}

export interface PermisosResponse {
  data: Permiso[];
  nombresTotales: NombreTotal[];
  tieneParametrosPendientes: boolean;
}

export interface Regional {
  id: string;
  descripcion: string;
}
