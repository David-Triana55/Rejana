import { DomainError } from '../../../../shared/domain/errors/domain-error.js';

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super('El usuario ya existe', 409, 'USER_ALREADY_EXISTS');
  }
}
