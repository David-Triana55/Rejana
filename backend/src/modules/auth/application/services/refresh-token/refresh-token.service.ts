import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  type AuthRepository,
} from '../../../domain/ports/out/auth.repository.js';
import {
  TOKEN_PORT,
  type TokenPort,
} from '../../../domain/ports/out/token.port.js';
import {
  REFRESH_TOKEN_HASHER,
  type RefreshTokenHasherPort,
} from '../../../domain/ports/out/refresh-token-hasher.port.js';
import { RefreshTokenResponse } from '../../dto/refresh-token-response.dto.js';
import { InvalidRefreshTokenError } from '../../../domain/errors/invalid-refresh-token.error.js';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: AuthRepository,
    @Inject(TOKEN_PORT) private readonly tokenPort: TokenPort,
    @Inject(REFRESH_TOKEN_HASHER)
    private readonly refreshHasher: RefreshTokenHasherPort,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      let payload = await this.tokenPort.verifyRefresh(refreshToken);
      
      const user = await this.authRepo.findByEmail(payload.email);
      if (!user || user.id !== payload.sub) {
        throw new InvalidRefreshTokenError();
      }
      
      const claims = { sub: user.id, email: user.email, role: user.role };
      const newRefreshToken = await this.tokenPort.signRefresh(claims);

      const rotated = await this.authRepo.rotateRefreshTokenHash(
        user.id,
        this.refreshHasher.hash(refreshToken),
        this.refreshHasher.hash(newRefreshToken),
      );
      if (!rotated) {
        await this.authRepo.saveRefreshTokenHash(user.id, null);
        throw new InvalidRefreshTokenError();
      }

      return {
        accessToken: await this.tokenPort.sign(claims),
        refreshToken: newRefreshToken,
      };
    }
    catch (err) {
      throw new InvalidRefreshTokenError();
    }
  }
}
