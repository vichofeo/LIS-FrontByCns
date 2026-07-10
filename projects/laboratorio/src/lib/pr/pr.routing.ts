import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios-page.component').then(m => m.ServiciosPageComponent),
  },
]
