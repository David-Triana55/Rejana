import { RoleName } from '../../../../shared/domain/enums/role.js';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string | null;
  role: RoleName;
}
