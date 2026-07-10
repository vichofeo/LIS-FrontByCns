import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class VigenciaService {
  uri: string
  private http = inject(HttpClient)
  // controller: string = 'UltimoPago';
  constructor() {
    if (environment.production) {
      this.uri = `${environment.api}/erpcns/${environment.apiVersion}`
    } else {
      this.uri = `${environment.erpCnsApi}/${environment.apiVersion}`
    }
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getUltimoPago(ci: string, fechaNacimiento: any, aseguradoId?: any) {
    const asegId = aseguradoId ? `&aseguradoId=${aseguradoId}` : ''
    return this.http.get<any[]>(
      `${this.uri}/Vigencia/UltimoPago?numeroDocumento=${ci}&fechaNacimiento=${fechaNacimiento}${asegId}&autocomplete=1`,
    )
  }

  getUltimoPagoExterno(ci: string, fechaNacimiento: any, aseguradoId?: any) {
    const asegId = aseguradoId ? `&aseguradoId=${aseguradoId}` : ''
    return this.http.get<any[]>(
      `${this.uri}/Vigencia/UltimoPago/externo?numeroDocumento=${ci}&fechaNacimiento=${fechaNacimiento}${asegId}&autocomplete=1`,
    )
  }

  getPersonalSinAfiliacion(ci: string) {
    return this.http.get<any[]>(`${this.uri}/Vigencia/UltimoPago?numeroDocumento=${ci}`)
  }

  getEstadoMora(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/CitasMedicas/GetAseguradoById`, {
      params: dataQuery as HttpParams,
    })
  }

  getGrupoFamiliar(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/CitasMedicas/GetGrupoFamiliar`, {
      params: dataQuery as HttpParams,
    })
  }

  postVerificarAtencion(data: any) {
    return this.http.post(`${this.uri}/Assus/VerificarAtencion`, data)
  }
}
