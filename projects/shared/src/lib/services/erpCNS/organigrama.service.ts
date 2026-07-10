import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs/operators'

import { Organigrama, OrganigramaJerarquia, OrganigramaRegionalDistrital } from '../../models/organigrama'

@Injectable({
  providedIn: 'root',
})
export class OrganigramaService {
  uri: string
  private http = inject(HttpClient)

  constructor() {
    if (environment.production) {
      this.uri = `${environment.api}/erpcns/${environment.apiVersion}`
    } else {
      this.uri = `${environment.erpCnsApi}/${environment.apiVersion}`
    }
  }

  getSearchOrganigrama(id: number, search: string) {
    search = search.length > 0 ? `?search=${search}` : ''
    return this.http
      .get<Organigrama[]>(`${this.uri}/Organigrama/searchOrganigrama/${id}${search}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getOrganigramaRegionalDistrital(id: number) {
    return this.http
      .get<OrganigramaRegionalDistrital[]>(`${this.uri}/Organigrama/GetOrganigramaRegionalDistrital?OrganigramaId=${id}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getGetOrganigramaJerarquia(organigramaId: number) {
    return this.http
      .get<OrganigramaJerarquia[]>(`${this.uri}/Organigrama/GetOrganigramaJerarquia/${organigramaId}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getSearchGetOrganigramaJerarquia(regionalId: number, search: string, autocomplete?: boolean) {
    return this.http
      .get<OrganigramaJerarquia[]>(
        `${this.uri
        }/Organigrama/SearchOrganigramaJerarquia?regionalId=${regionalId}&search=${search}${autocomplete ? '&autocomplete=1' : ''
        }`,
      )
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getOrganigramaByIds(id: number) {
    return this.http
      .get<Organigrama[]>(`${this.uri}/Organigrama/GetByIds/${id}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
