import { DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import Aura from '@primeng/themes/aura'
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage,
  provideOAuthClient,
} from 'angular-oauth2-oidc'
import { ConfirmationService, MessageService } from 'primeng/api'
import { providePrimeNG } from 'primeng/config'
import { DialogService } from 'primeng/dynamicdialog'

import { environment } from '@env/environment'
import { jwtInterceptor } from 'auth'
import { authAppInitializerFactory } from 'auth'
import { authConfig } from 'auth'
import { authModuleConfig } from 'auth'
import { storageFactory } from 'auth'
import { AuthService } from 'auth'
import { LIS_API_BASE_URL } from 'laboratorio'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideAnimations(),
    importProvidersFrom(ReactiveFormsModule, OAuthModule.forRoot()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideOAuthClient(),
    provideAppInitializer(() => {
      const authService = inject(AuthService)
      return authAppInitializerFactory(authService)()
    }),
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthModuleConfig, useValue: authModuleConfig },
    { provide: OAuthStorage, useFactory: storageFactory },
    { provide: LIS_API_BASE_URL, useValue: environment.lisApi },
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    ConfirmationService,
    MessageService,
    DialogService,
    DatePipe,
  ],
}
