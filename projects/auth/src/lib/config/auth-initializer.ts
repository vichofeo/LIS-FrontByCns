import { AuthService } from '../services/auth.service'

export function authAppInitializerFactory(authService: AuthService): () => Promise<void> {
  return () => authService.runInitialLoginSequence()
}
