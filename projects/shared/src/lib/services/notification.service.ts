import { Injectable, inject } from '@angular/core'
import { MessageService } from 'primeng/api'
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService)

  showInfo(summary: string, detail: string, life = 8000) {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life,
    })
  }

  showWarn(summary: string, detail: string, life = 8000) {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life,
    })
  }

  showError(summary: string, detail: string, life = 10000) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life,
    })
  }

  showSuccess(summary: string, detail: string, life = 5000) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life,
    })
  }
}
