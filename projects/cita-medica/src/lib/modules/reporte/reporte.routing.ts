import { Routes } from '@angular/router'
import { accesGuard, managerResolver } from 'shared'
import { SeguimientoMedicoList } from './seguimiento-medico-list/seguimiento-medico-list'
import { ReservasEliminadasList } from './reservas-eliminadas-list/reservas-eliminadas-list'

export const routes: Routes = [
  {
    path: 'seguimiento',
    component: SeguimientoMedicoList,
    resolve: { manager: managerResolver },
    canActivate: [accesGuard],
  },
  {
    path: 'delete-reservas',
    component: ReservasEliminadasList,
    resolve: { manager: managerResolver },
    canActivate: [accesGuard],
  },
]
