import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import Swal, { SweetAlertIcon } from 'sweetalert2'

@Injectable({
  providedIn: 'root',
})
export class Sweetalert {
  private router = inject(Router)

  showMessage(title: string, text: string, icono: SweetAlertIcon, timer: number, url: string) {
    const observer = this.blockAriaHidden()
    Swal.fire({
      title: title,
      text: text,
      icon: icono,
      allowOutsideClick: false,
      confirmButtonText: 'Aceptar',
      timer: timer,
      willClose: () => observer.disconnect(),
      timerProgressBar: true,
      customClass: {
        confirmButton: 'p-button',
      },
    }).then(() => {
      this.router.navigate([url])
    })
  }

  showMessageCallback(title: string, text: string, icono: SweetAlertIcon, timer: number) {
    const observer = this.blockAriaHidden()
    Swal.fire({
      title: title,
      text: text,
      icon: icono,
      allowOutsideClick: false,
      confirmButtonText: 'Aceptar',
      timer: timer,
      willClose: () => observer.disconnect(),
      timerProgressBar: true,
      customClass: {
        confirmButton: 'p-button',
      },
    }).then(() => {
      // location.href = url;
    })
  }

  showWaiting(method: string) {
    let html
    switch (method) {
      case 'GET':
        html = 'Obteniendo información...'
        break
      case 'POST':
        html = 'Guardando información...'
        break
      case 'PUT':
        html = 'Actualizando información...'
        break
      case 'DELETE':
        html = 'Eliminando información...'
        break

      default:
        html = 'Cargando información...'
        break
    }
    const observer = this.blockAriaHidden()
    Swal.fire({
      html: html,
      allowOutsideClick: false,
      returnFocus: false,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => observer.disconnect(),
    })
  }

  closeModal() {
    Swal.close()
  }

  private blockAriaHidden(): MutationObserver {
    const appRoot = document.querySelector('app-root')
    const observer = new MutationObserver(() => {
      if (appRoot?.getAttribute('aria-hidden') === 'true') {
        appRoot.removeAttribute('aria-hidden')
      }
    })
    if (appRoot) {
      observer.observe(appRoot, { attributes: true, attributeFilter: ['aria-hidden'] })
    }
    return observer
  }
}
