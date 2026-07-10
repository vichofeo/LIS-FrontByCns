import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CardModule } from 'primeng/card'

import { Aviso } from '../../models/aviso'

@Component({
  selector: 'lib-plantilla-aviso',
  imports: [CardModule],
  templateUrl: './plantilla-aviso.html',
  styleUrl: './plantilla-aviso.scss',
})
export class PlantillaAviso implements OnInit {
  errores: Aviso[] = [
    {
      titulo: 'Acceso no autorizado',
      codigo: '401',
      descripcion: 'No tiene permiso de acceder al recurso solicitado.',
    },
    {
      titulo: 'La página no se encuentra.',
      codigo: '404',
      descripcion: 'La página no se encuentra. Se puede revisar los enlaces permanentes.',
    },
    {
      titulo: 'No se tiene permiso de acceso',
      codigo: '403',
      descripcion:
        'No se tiene permiso de acceso. Se puede limpiar el caché y hacer pruebas deshabilitando firewalls.',
    },
    {
      titulo: 'El método HTTP utilizado no está permitido para el recurso solicitado',
      codigo: '405',
      descripcion:
        'El método HTTP utilizado no está permitido para el recurso solicitado. Se debe verificar que el método HTTP utilizado en la solicitud esté permitido para el recurso.',
    },
    {
      titulo: 'Se requiere autenticación proxy',
      codigo: '407',
      descripcion: 'Se requiere autenticación proxy.',
    },
    {
      titulo: 'Se alcanzó el tiempo de espera de la solicitud',
      codigo: '408',
      descripcion: 'Se alcanzó el tiempo de espera de la solicitud.',
    },
    {
      titulo: 'Se trata de un error de servidor',
      codigo: '500',
      descripcion: 'Se trata de un error de servidor.',
    },
  ]
  error!: Aviso
  codigo = ''
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.codigo = routeParams['codigo']
      const errorEncontrado = this.errores.find(error => error.codigo === this.codigo)
      if (errorEncontrado) {
        this.error = errorEncontrado
      }
    })
  }
}
