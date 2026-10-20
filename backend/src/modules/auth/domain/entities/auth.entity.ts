import { RoleName } from '../../../../shared/domain/enums/role.js';

export class Auth {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly role: RoleName,
    readonly passwordHash?: string,
    readonly name?: string | null,
  ) {}
}
