import { Route } from '@angular/router'

export const laboratorioRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: 'parametrizacion', loadChildren: () => import('./parametrizacion/parametrizacion.routing').then(m => m.routes) },
      { path: 'configuracion',   loadChildren: () => import('./configuracion/configuracion.routing').then(m => m.routes) },
      { path: 'preanalitica',    loadChildren: () => import('./preanalitica/preanalitica.routing').then(m => m.routes) },
      { path: 'analitica',       loadChildren: () => import('./analitica/analitica.routing').then(m => m.routes) },
      { path: 'postanalitica',   loadChildren: () => import('./postanalitica/postanalitica.routing').then(m => m.routes) },
      { path: 'pr',             loadChildren: () => import('./pr/pr.routing').then(m => m.routes) },
    ],
  },
]
