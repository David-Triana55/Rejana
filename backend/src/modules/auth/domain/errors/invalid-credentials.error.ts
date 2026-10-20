import { DomainError } from '../../../../shared/domain/errors/domain-error.js';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
  }
}
