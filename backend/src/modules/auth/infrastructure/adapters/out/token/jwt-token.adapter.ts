import { Injectable } from '@nestjs/common';
import { TokenPort } from '../../../../domain/ports/out/token.port.js';
import { RoleName } from '../../../../../../shared/domain/enums/role.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenAdapter implements TokenPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: { sub: string; email: string; role: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verify(
    token: string,
  ): Promise<{ sub: string; email: string; role: RoleName }> {
    return this.jwtService.verifyAsync(token);
  }
}
