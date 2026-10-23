import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { RefreshTokenService } from './refresh-token.service.js';
import { Role } from '../../../../../shared/domain/enums/role.js';
import { AuthRepository } from '../../../domain/ports/out/auth.repository.js';
import { TokenPort } from '../../../domain/ports/out/token.port.js';
import { RefreshTokenHasherPort } from '../../../domain/ports/out/refresh-token-hasher.port.js';
import { Auth } from '../../../domain/entities/auth.entity.js';
import { InvalidRefreshTokenError } from '../../../domain/errors/invalid-refresh-token.error.js';

describe('RefreshTokenService', () => {
  let authRepository: Mocked<AuthRepository>;
  let tokenPort: Mocked<TokenPort>;
  let refreshHasher: Mocked<RefreshTokenHasherPort>;
  let service: RefreshTokenService;

  const user = new Auth('user-id', 'admin@test.com', Role.Admin, 'hash', 'Admin');
  const payload = { sub: 'user-id', email: user.email, role: Role.Admin };

  beforeEach(() => {
    authRepository = {
      findByEmail: vi.fn(),
      Create: vi.fn(),
      saveRefreshTokenHash: vi.fn(),
      rotateRefreshTokenHash: vi.fn(),
    };
    tokenPort = {
      sign: vi.fn(),
      signRefresh: vi.fn(),
      verify: vi.fn(),
      verifyRefresh: vi.fn(),
    };
    refreshHasher = { hash: vi.fn((t: string) => `hash:${t}`) };
    service = new RefreshTokenService(authRepository, tokenPort, refreshHasher);
  });

  it('rotates tokens when the presented refresh token is the stored one', async () => {
    tokenPort.verifyRefresh.mockResolvedValue(payload);
    authRepository.findByEmail.mockResolvedValue(user);
    tokenPort.sign.mockResolvedValue('new-access');
    tokenPort.signRefresh.mockResolvedValue('new-refresh');
    authRepository.rotateRefreshTokenHash.mockResolvedValue(true);

    const result = await service.execute('old-refresh');

    expect(result).toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
    expect(authRepository.rotateRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      'hash:old-refresh',
      'hash:new-refresh',
    );
    expect(tokenPort.sign).toHaveBeenCalledWith(payload);
  });

  it('revokes the session when the token is not the stored one (reuse)', async () => {
    tokenPort.verifyRefresh.mockResolvedValue(payload);
    authRepository.findByEmail.mockResolvedValue(user);
    tokenPort.signRefresh.mockResolvedValue('new-refresh');
    authRepository.rotateRefreshTokenHash.mockResolvedValue(false);

    await expect(service.execute('old-refresh')).rejects.toThrow(
      InvalidRefreshTokenError,
    );

    expect(authRepository.saveRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      null,
    );
    expect(tokenPort.sign).not.toHaveBeenCalled();
  });

  it('throws when the refresh token is invalid or expired', async () => {
    tokenPort.verifyRefresh.mockRejectedValue(new Error('jwt expired'));

    await expect(service.execute('bad')).rejects.toThrow(
      InvalidRefreshTokenError,
    );
    expect(tokenPort.sign).not.toHaveBeenCalled();
  });

  it('throws when the user no longer exists', async () => {
    tokenPort.verifyRefresh.mockResolvedValue(payload);
    authRepository.findByEmail.mockResolvedValue(null);

    await expect(service.execute('t')).rejects.toThrow(InvalidRefreshTokenError);
  });

  it('throws when the user id does not match the token subject', async () => {
    tokenPort.verifyRefresh.mockResolvedValue({ ...payload, sub: 'other' });
    authRepository.findByEmail.mockResolvedValue(user);

    await expect(service.execute('t')).rejects.toThrow(InvalidRefreshTokenError);
  });
});
