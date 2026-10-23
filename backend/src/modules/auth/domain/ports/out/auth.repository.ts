import { Auth } from '../../entities/auth.entity.js';

export interface AuthRepository {
  findByEmail(email: string): Promise<Auth | null>;
  Create(auth: Auth): Promise<void>;
  saveRefreshTokenHash(id: string, hash: string | null): Promise<void>;
  rotateRefreshTokenHash(
    id: string,
    current: string,
    next: string,
  ): Promise<boolean>;
}

export const AUTH_REPOSITORY = Symbol('AuthRepository');
