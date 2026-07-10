import { environment } from '@env/environment'
import { AuthConfig } from 'angular-oauth2-oidc'

export const authConfig: AuthConfig = {
  issuer: environment.issuer,
  clientId: environment.clientId,
  responseType: environment.responseType,
  redirectUri: `${window.location.origin}${environment.redirectUri}`,
  silentRefreshRedirectUri: `${window.location.origin}${environment.silentRefreshRedirectUri}`,
  scope: environment.scope,
  postLogoutRedirectUri: `${window.location.origin}${environment.postLogoutRedirectUri}`,
  sessionChecksEnabled: environment.sessionChecksEnabled,
  showDebugInformation: environment.showDebugInformation,
  clearHashAfterLogin: environment.clearHashAfterLogin,
  nonceStateSeparator: environment.nonceStateSeparator,
  useSilentRefresh: environment.useSilentRefresh,
}
