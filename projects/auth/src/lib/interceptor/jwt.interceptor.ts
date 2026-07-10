import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { environment } from '@env/environment'
import { catchError, tap, throwError } from 'rxjs'
import { NotificationService, Sweetalert } from 'shared'
import { WarningService } from 'shared'

import { AuthService } from '../services/auth.service'

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const notificationService = inject(NotificationService)
  const loadingService = inject(Sweetalert)
  const warningService = inject(WarningService)

  if (shouldBypassUrl(req.url)) {
    return next(req)
  }

  // Verificar si la request tiene header para evitar loading
  const skipLoading = req.headers.get('skip-loading') === 'true'

  if (!skipLoading) {
    loadingService.showWaiting(getLoadingMessage(req.method))
  }

  const clonedRequest = addAuthorizationHeader(req, authService.accessToken)

  return next(clonedRequest).pipe(
    tap(event => {
      if (event instanceof HttpResponse && !skipLoading) {
        loadingService.closeModal()
      }
    }),
    catchError((error: unknown) => {
      if (!skipLoading) {
        loadingService.closeModal()
      }

      if (error instanceof HttpErrorResponse) {
        handleHttpError(error, notificationService, authService, warningService)
      } else {
        handleGenericError(error, notificationService)
      }
      return throwError(() => error)
    }),
  )
}
//#region  Funciones auxiliares
const extractCustomErrorMessage = (error: HttpErrorResponse): string | null => {
  try {
    if (error.error?.errors) {
      // Buscar mensajes en la estructura de errores
      const errors = error.error.errors

      // Primero intentar obtener errores con clave vacía ""
      if (errors[''] && Array.isArray(errors['']) && errors[''].length > 0) {
        return errors[''].join(', ')
      }

      // Si no hay errores con clave vacía, buscar el primer error disponible
      const firstErrorKey = Object.keys(errors).find(
        key => Array.isArray(errors[key]) && errors[key].length > 0,
      )

      if (firstErrorKey) {
        return errors[firstErrorKey].join(', ')
      }
    }

    return null
  } catch {
    return null
  }
}

const addAuthorizationHeader = (req: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  })
}

const shouldBypassUrl = (url: string): boolean => {
  return [environment.issuer].some(u => url.startsWith(u))
}

const getLoadingMessage = (method: string): string => {
  const messages: Record<string, string> = {
    GET: 'Obteniendo información...',
    POST: 'Guardando información...',
    PUT: 'Actualizando información...',
    DELETE: 'Eliminando información...',
  }
  return messages[method] || 'Procesando...'
}

const handleHttpError = (
  error: HttpErrorResponse,
  notificationService: NotificationService,
  authService: AuthService,
  warningService: WarningService,
): void => {
  const status = error.status
  const backendMessage = extractCustomErrorMessage(error) || error.error?.detail

  const defaultMessage =
    status < 500 ? getClientErrorMessage(status) : getServerErrorMessage(status)

  const messageToShow = backendMessage || defaultMessage

  const fullMessage = environment.production
    ? messageToShow
    : `${messageToShow} (Código: ${status})`

  if (status >= 400 && status < 500) {
    if (status === 401) {
      warningService.show(`Advertencia!!`, fullMessage, () => authService.logout())
    } else {
      warningService.show(`Advertencia!!`, fullMessage, () => { /* empty */ })
    }
  } else if (status >= 500 && status <= 599) {
    notificationService.showError(`Error!!`, fullMessage)
  }
}

const handleGenericError = (error: unknown, notificationService: NotificationService): void => {
  let errorMessage = 'Error desconocido'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = (error as { message: string }).message
  }
  notificationService.showError('¡Ocurrió un Error!', errorMessage, 20000)
}

const getClientErrorMessage = (status: number): string => {
  const clientErrorMessages: Record<number, string> = {
    400: 'Solicitud incorrecta. Verifica los datos ingresados.',
    401: 'No autorizado,El tiempo de sesión ha caducado. Debes iniciar sesión.',
    403: 'Acceso denegado. No tienes permiso para acceder a este recurso.',
    404: 'Recurso no encontrado. Verifica la URL.',
    405: 'Método no permitido en este recurso.',
    408: 'Tiempo de espera agotado. Inténtalo nuevamente más tarde.',
    422: 'Los datos enviados no son válidos. Por favor, revisa los campos y vuelve a intentarlo.',
    429: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
  }
  return clientErrorMessages[status] || 'Error en la solicitud. Por favor, inténtalo nuevamente.'
}

const getServerErrorMessage = (status: number): string => {
  const serverErrorMessages: Record<number, string> = {
    500: 'Error en el servidor. Por favor, intente más tarde.',
    502: 'Error en la conexión con el servidor. Intente nuevamente.',
    503: 'El servicio no está disponible en este momento. Intente más tarde.',
    504: 'Tiempo de espera agotado en la conexión con el servidor. Intente de nuevo.',
  }
  return serverErrorMessages[status] || 'Error en el servidor. Inténtelo nuevamente más tarde.'
}
//#endregion
