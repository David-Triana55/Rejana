import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { LogoutService } from './logout.service.js';
import { Role } from '../../../../../shared/domain/enums/role.js';
import { AuthRepository } from '../../../domain/ports/out/auth.repository.js';
import { TokenPort } from '../../../domain/ports/out/token.port.js';

describe('LogoutService', () => {
  let authRepository: Mocked<AuthRepository>;
  let tokenPort: Mocked<TokenPort>;
  let service: LogoutService;

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
    service = new LogoutService(authRepository, tokenPort);
  });

  it('clears the stored hash for a valid refresh token', async () => {
    tokenPort.verifyRefresh.mockResolvedValue({
      sub: 'user-id',
      email: 'a@b.com',
      role: Role.Admin,
    });

    await service.execute('token');

    expect(authRepository.saveRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      null,
    );
  });

  it('does nothing without a token', async () => {
    await service.execute(undefined);

    expect(tokenPort.verifyRefresh).not.toHaveBeenCalled();
    expect(authRepository.saveRefreshTokenHash).not.toHaveBeenCalled();
  });

  it('does not throw on an invalid token', async () => {
    tokenPort.verifyRefresh.mockRejectedValue(new Error('jwt expired'));

    await expect(service.execute('bad')).resolves.toBeUndefined();
    expect(authRepository.saveRefreshTokenHash).not.toHaveBeenCalled();
  });
});
