import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LaboratorioLogger {
  private tag = '[LAB]'

  info(area: string, msg: string, data?: unknown) {
    console.log(`${this.tag}[${area}]`, msg, data ?? '')
  }

  warn(area: string, msg: string, data?: unknown) {
    console.warn(`${this.tag}[${area}]`, msg, data ?? '')
  }

  error(area: string, msg: string, data?: unknown) {
    console.error(`${this.tag}[${area}]`, msg, data ?? '')
  }
}
