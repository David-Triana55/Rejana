import { RoleName } from '../../../../../shared/domain/enums/role.js';

export interface TokenPort {
  sign(payload: { sub: string; email: string; role: string }): Promise<string>;
  signRefresh(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<string>;
  verifyRefresh(
    token: string,
  ): Promise<{ sub: string; email: string; role: RoleName }>;
  verify(
    token: string,
  ): Promise<{ sub: string; email: string; role: RoleName }>;
}

export const TOKEN_PORT = Symbol('TokenPort');
