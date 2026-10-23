import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { TokenPort } from '../../../../domain/ports/out/token.port.js';
import { RoleName } from '../../../../../../shared/domain/enums/role.js';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenAdapter implements TokenPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  sign(payload: { sub: string; email: string; role: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  signRefresh(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      jwtid: randomUUID(),
      expiresIn: this.config.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
      ) as JwtSignOptions['expiresIn'],
    });
  }

  verifyRefresh(
    token: string,
  ): Promise<{ sub: string; email: string; role: RoleName }> {
    return this.jwtService.verifyAsync(token, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  verify(
    token: string,
  ): Promise<{ sub: string; email: string; role: RoleName }> {
    return this.jwtService.verifyAsync(token);
  }
}
