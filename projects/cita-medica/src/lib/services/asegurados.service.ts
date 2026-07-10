import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AseguradosService {
  uri: string
  controller = 'Asegurados'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getAll(search: string, autocomplete?: boolean) {
    return this.http
      .get<any[]>(`${this.uri}?search=${search}${autocomplete ? '&autocomplete=1' : ''}`)
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              nombre_completo: x.nombres + ' ' + x.paterno + ' ' + x.materno,
            }
          })
        }),
      )
      .toPromise()
  }
  getAllSearch(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/search`, { params: dataQuery as HttpParams })
  }

  getEstadoMora(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/estadoMora/byId`, { params: dataQuery as HttpParams })
  }

  getGrupoFamiliar(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/searchByTitular`, { params: dataQuery as HttpParams })
  }

  getImagenAsegurado(dataQuery: any) {
    return this.http.get<any>(`${this.uri}/imagen`, { params: dataQuery as HttpParams })
  }

  getAportesEmpresa(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/aportesEmpresa`, { params: dataQuery as HttpParams })
  }

  getDireccionAsegurado(dataQuery: any) {
    return this.http.get<any>(`${this.uri}/direccionAsegurado`, { params: dataQuery as HttpParams })
  }

  getAportesVoluntarioAbogado(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/aportesVoluntarioAbogado`, {
      params: dataQuery as HttpParams,
    })
  }

  getEmpresasByCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/empresasByCentroMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  putPhone(data: any) {
    return this.http.put(`${this.uri}/phone`, data)
  }
}
