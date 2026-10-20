import { RoleName } from '../../../../../shared/domain/enums/role.js';

export interface TokenPort {
  sign(payload: { sub: string; email: string; role: string }): Promise<string>;
  verify(
    token: string,
  ): Promise<{ sub: string; email: string; role: RoleName }>;
}

export const TOKEN_PORT = Symbol('TokenPort');
