import { RoleName } from '../../../domain/enums/role.js';

export interface AuthenticatedUser {
  sub: string;
  email: string;
  role: RoleName;
}
