import { Injectable, inject } from '@angular/core'
import { MessageService } from 'primeng/api'
import messages from './messages/laboratorio-messages.json'

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private msj = messages as Record<string, string>
  private toast = inject(MessageService)

  get(code: string, params?: Record<string, string>): string {
    let msg = this.msj[code] ?? `Código no definido: ${code}`
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        msg = msg.replace(`{{${k}}}`, v)
      }
    }
    return msg
  }

  showError(code: string, params?: Record<string, string>) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: this.get(code, params), life: 10000 })
  }

  showSuccess(code: string, params?: Record<string, string>) {
    this.toast.add({ severity: 'success', summary: 'Éxito', detail: this.get(code, params), life: 5000 })
  }

  showWarn(code: string, params?: Record<string, string>) {
    this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: this.get(code, params), life: 8000 })
  }
}
