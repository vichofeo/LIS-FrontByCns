import { Usuario } from "./Usuario";

export interface UsuarioConfiguracion {
  id: number;
  usuarioId: string;
  idsRegional: number[];
  idsCentros: number[];
  idsConsultorio: number[];
  estado: boolean;
  isAdmin: boolean;
  fechaCreacion: string;
  usuario: Usuario;
}
