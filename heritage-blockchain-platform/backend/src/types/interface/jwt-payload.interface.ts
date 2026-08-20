import { UserRole } from "../enums/rbac.js"

export interface JwtPayload {
  sub: string
  email: string
  roles: UserRole
  jti: string // unique token id, có thể add blacklist
  iat?: number
  exp?: number
}
