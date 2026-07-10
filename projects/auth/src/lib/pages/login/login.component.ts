import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Observable, Subscription } from 'rxjs'

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthenticated: Observable<boolean> | undefined
  public loading = false
  private stream: Subscription = new Subscription()
  private authService = inject(AuthService)
  constructor() {
    this.isAuthenticated = this.authService.isAuthenticated$
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.loading = true
    this.authService.login('/auth-callback')
  }

  public login(): void {
    this.loading = true
    this.authService.login('/auth-callback')
  }

  public logout(): void {
    this.authService.logout()
  }
}
