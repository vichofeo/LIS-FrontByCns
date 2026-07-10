import { Routes } from '@angular/router'
import { accesGuard, managerResolver } from 'shared'

import { ConsultorioUsuarioList } from './consultorio-usuario-list/consultorio-usuario-list'

export const routes: Routes = [
  {
    path: '',
    component: ConsultorioUsuarioList,
    resolve: { manager: managerResolver },
    canActivate: [accesGuard],
  },
]
