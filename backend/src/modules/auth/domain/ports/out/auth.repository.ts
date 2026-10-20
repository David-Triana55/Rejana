import { Auth } from '../../entities/auth.entity.js';

export interface AuthRepository {
  findByEmail(email: string): Promise<Auth | null>;
  Create(auth: Auth): Promise<void>;
}

export const AUTH_REPOSITORY = Symbol('AuthRepository');
