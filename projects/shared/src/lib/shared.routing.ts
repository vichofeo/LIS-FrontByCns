import { Route } from '@angular/router'

import { PlantillaAviso } from './pages/plantilla-aviso/plantilla-aviso'

export const sharedRoutes: Route[] = [
  {
    path: 'aviso/:codigo',
    component: PlantillaAviso,
  },
]
