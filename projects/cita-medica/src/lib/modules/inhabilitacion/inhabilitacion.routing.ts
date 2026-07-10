import { Routes } from '@angular/router'
import { InhabilitacionList } from './inhabilitacion-list/inhabilitacion-list'
import { accesGuard, managerResolver } from 'shared'

export const routes: Routes = ([] = [
  {
    path: '',
    component: InhabilitacionList,
    resolve: { manager: managerResolver },
    canActivate: [accesGuard],
  },
])
