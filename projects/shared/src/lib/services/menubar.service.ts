import { Injectable } from '@angular/core'
import { MenuItem } from 'primeng/api'

import { PermisoValor, PermisosResponse } from '../models/permiso'

@Injectable({
  providedIn: 'root',
})
export class MenubarService {

  disableMenuOptions(
    menu: MenuItem[],
    permisos: PermisosResponse,
  ): MenuItem[] {
    for (const menuItem of menu) {
      const permiso = permisos.data.find(
        p => p.nombre === menuItem.id,
      )

      if (permiso?.valores.length) {
        menuItem.disabled =
          permiso.valores[0].valor !== 'true'
      }
    }
    return menu
  }

  hideOptions<T extends object>(
    control: string,
    data: T[],
    property: keyof T,
    permisos: PermisosResponse,
    hasAll?: T | null,
  ): T[] {
    const dataWithAll = hasAll ? [hasAll, ...data] : data;

    const itemPermiso = permisos.data.find(
      item => item.nombre === control,
    );

    if (!itemPermiso) {
      return dataWithAll;
    }

    const itemsVisibles = this.mapValuesDrop(itemPermiso.valores);

    if (itemsVisibles.includes('0')) {
      return dataWithAll;
    }

    return dataWithAll.filter(item =>
      itemsVisibles.includes(String(item[property])),
    );
  }

  mapValuesDrop(values: PermisoValor[]): string[] {
    const array = values.map(item => {
      return item.valor
    })
    return array
  }
}
