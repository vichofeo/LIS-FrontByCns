import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios').then(m => m.Servicios),
  },
  {
    path: 'cfg-areas',
    loadComponent: () => import('./pages/cfg-areas').then(m => m.CfgAreas),
  },
]
