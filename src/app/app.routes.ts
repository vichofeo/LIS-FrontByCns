import { Routes } from '@angular/router'

import { autWithForcedLoginGuard } from 'auth'
import { LoginComponent } from 'auth'
import { AuthCallbackComponent } from 'auth'

import { Layout } from './main/pages/layout/layout'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'admin',
    component: Layout,
    children: [
      {
        path: 'usuario',
        loadChildren: () => import('usuario').then(m => m.usuarioRoutes),
      },
      {
        path: 'citaMedica',
        loadChildren: () => import('cita-medica').then(m => m.citaMedicaRoutes),
      },
      {
        path: 'vigencia',
        loadChildren: () => import('vigencia').then(m => m.vigenciaRoutes),
      },
      {
        path: 'farmacia',
        loadChildren: () => import('farmacia').then(m => m.farmaciaRoutes),
      },
      {
        path: 'laboratorio',
        loadChildren: () => import('laboratorio').then(m => m.laboratorioRoutes),
      },
      {
        path: 'consulta-externa',
        loadChildren: () => import('consulta-externa').then(m => m.consultaExternaRoutes),
      },
      {
        path: 'internacion',
        loadChildren: () => import('internacion').then(m => m.internacionRoutes),
      },
      {
        path: 'shared',
        loadChildren: () => import('shared').then(m => m.sharedRoutes),
      },
    ],
    canActivate: [autWithForcedLoginGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  {
    path: '**',
    redirectTo: 'admin/shared/aviso/404',
    pathMatch: 'full',
  },
]
