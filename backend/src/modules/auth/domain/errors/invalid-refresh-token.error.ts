import { DomainError } from '../../../../shared/domain/errors/domain-error.js';

export class InvalidRefreshTokenError extends DomainError {
  constructor() {
    super('Refresh token inválido o expirado', 401, 'REFRESH_TOKEN_INVALID');
  }
}
