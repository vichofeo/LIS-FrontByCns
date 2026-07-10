import { Route } from '@angular/router'

export const vigenciaRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'consultorio',
        loadChildren: () => import('./modules/consultorio/consultorio.routing').then(m => m.routes),
      },
      {
        path: 'centroMedico',
        loadChildren: () =>
          import('./modules/centro-medico/centro-medico.routing').then(m => m.routes),
      },
      {
        path: 'adscripcion',
        loadChildren: () => import('./modules/adscripcion/adscripcion.routing').then(m => m.routes),
      },
      {
        path: 'vigencia-asegurado',
        loadChildren: () => import('./modules/asegurado/asegurado.routing').then(m => m.routes),
      },
      {
        path: 'inhabilitacion',
        loadChildren: () =>
          import('./modules/inhabilitacion/inhabilitacion.routing').then(m => m.routes),
      },
    ],
  },
]
