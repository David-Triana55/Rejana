export interface RefreshTokenHasherPort {
  hash(token: string): string;
}

export const REFRESH_TOKEN_HASHER = Symbol('RefreshTokenHasher');
