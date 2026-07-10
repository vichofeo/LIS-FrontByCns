export interface User {
  id: number
  username: string
  password: string
  unique_name: string
  family_name: string
  token?: string
}

export interface UsuarioRequest {
  id: string;
  userName: string;
  identidad: string;
  phoneNumber: string;
  email: string;
  nombres: string;
  numeroDocumento: string;
  fechaNacimiento: string;
}
