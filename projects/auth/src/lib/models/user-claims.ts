export interface UserClaims {
  sub?: string
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  email?: string
  role?: string | string[]
  username?: string
}
