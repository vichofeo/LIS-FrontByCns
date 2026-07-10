import { Route } from '@angular/router'

export const citaMedicaRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'horario',
        loadChildren: () => import('./modules/horario/horario.routing').then(m => m.routes),
      },
      {
        path: 'horario-en-linea',
        loadChildren: () =>
          import('./modules/horario-en-linea/horario-en-linea.routing').then(m => m.routes),
      },
      {
        path: 'consultorio',
        loadChildren: () => import('./modules/consultorio/consultorio.routing').then(m => m.routes),
      },
      {
        path: 'reserva',
        loadChildren: () => import('./modules/reserva/reserva.routing').then(m => m.routes),
      },
      {
        path: 'atencion-reserva',
        loadChildren: () =>
          import('./modules/atencion-reserva/atencion-reserva.routing').then(m => m.routes),
      },
      {
        path: 'reporte',
        loadChildren: () => import('./modules/reporte/reporte.routing').then(m => m.routes),
      },
      {
        path: 'atencion',
        loadChildren: () =>
          import('./modules/busqueda-atencion/busqueda-atencion.routing').then(m => m.routes),
      },
      {
        path: 'panel-reserva',
        loadChildren: () => import('./modules/panel/panel.routing').then(m => m.routes),
      },
      {
        path: 'panel-rehabilitacion',
        loadChildren: () =>
          import('./modules/panel-rehabilitacion/panel-rehabilitacion.routing').then(m => m.routes),
      },
      {
        path: 'no-asegurado',
        loadChildren: () =>
          import('./modules/no-asegurado/no-asegurado.routing').then(m => m.routes),
      },
      {
        path: 'kardex',
        loadChildren: () => import('./modules/kardex/kardex.routing').then(m => m.routes),
      },
      {
        path: 'consultorio-usuario',
        loadChildren: () =>
          import('./modules/consultorio-usuario/consultorio-usuario.routing').then(m => m.routes),
      },
      {
        path: 'inhabilitacion',
        loadChildren: () =>
          import('./modules/inhabilitacion/inhabilitacion.routing').then(m => m.routes),
      },
    ],
  },
]
