import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription, take } from 'rxjs'

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private stream: Subscription = new Subscription()
  private isProcessing = false // Flag para evitar múltiples ejecuciones
  private authService = inject(AuthService)
  private router = inject(Router)


  ngOnInit(): void {
    this.stream = this.authService.canActivateProtectedRoutes$
      .pipe(take(1))
      .subscribe(async isAuthorized => {
        if (this.isProcessing) return
        this.isProcessing = true

        try {
          if (isAuthorized) {
            this.router.navigate(['/admin'])
          } else {
            this.router.navigate(['/login'])
          }
        } catch (error) {
          console.error('Error en proceso de autenticación:', error)
          this.router.navigate(['/login'])
        } finally {
          this.isProcessing = false
        }
      })
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe()
    }
  }
}
