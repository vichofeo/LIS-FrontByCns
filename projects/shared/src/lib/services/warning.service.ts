import { Injectable } from '@angular/core'
import Swal, { SweetAlertResult } from 'sweetalert2'

@Injectable({
  providedIn: 'root',
})
export class WarningService {
  private isOpen = false
  show(title: string, message: string, onAccept?: () => void): void {
    if (this.isOpen) return

    this.isOpen = true
    Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#f59e0b',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result: SweetAlertResult) => {
      this.isOpen = false
      if (result.isConfirmed) {
        onAccept?.()
      }
    })
  }
}
