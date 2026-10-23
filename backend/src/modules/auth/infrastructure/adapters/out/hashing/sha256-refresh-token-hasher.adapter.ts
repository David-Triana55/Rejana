import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { RefreshTokenHasherPort } from '../../../../domain/ports/out/refresh-token-hasher.port.js';

@Injectable()
export class Sha256RefreshTokenHasherAdapter implements RefreshTokenHasherPort {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
