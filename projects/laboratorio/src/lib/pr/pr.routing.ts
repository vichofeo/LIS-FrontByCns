import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios-page.component').then(m => m.ServiciosPageComponent),
  },
  {
    path: 'cfg-areas',
    loadComponent: () => import('./pages/cfg-areas-page.component').then(m => m.CfgAreasPageComponent),
  },
]
