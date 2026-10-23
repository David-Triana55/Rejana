import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  type AuthRepository,
} from '../../../domain/ports/out/auth.repository.js';
import {
  TOKEN_PORT,
  type TokenPort,
} from '../../../domain/ports/out/token.port.js';

@Injectable()
export class LogoutService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: AuthRepository,
    @Inject(TOKEN_PORT) private readonly tokenPort: TokenPort,
  ) {}

  async execute(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    let sub: string;
    try {
      ({ sub } = await this.tokenPort.verifyRefresh(refreshToken));
    } catch {
      return;
    }

    await this.authRepo.saveRefreshTokenHash(sub, null);
  }
}
