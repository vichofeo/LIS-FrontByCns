import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '@env/environment';
import { Version, VersionesState } from '@main/models/version';




@Injectable({
  providedIn: 'root',
})

export class VersionesService {
  uri: string;
  versionApi: string;

  versionesSubject = new BehaviorSubject<VersionesState>({});
  versiones$ = this.versionesSubject.asObservable();

  private http = inject(HttpClient)

  constructor() {
    this.uri = environment.api;
    this.versionApi = environment.apiVersion;
  }

  setVersiones(data: VersionesState): void {
    this.versionesSubject.next(data)
  }

  citasMedicas() {
    return this.http.get<Version>(
      `${this.uri}/citas-medicas/${this.versionApi}/Version`
    );
  }

  vigenciaDerecho() {
    return this.http.get<Version>(
      `${this.uri}/vigencia-derechos/${this.versionApi}/Version`
    );
  }
}
