import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { LoginService } from './login.service.js';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port.js';
import { Role } from '../../../../../shared/domain/enums/role.js';
import { AuthRepository } from '../../../domain/ports/out/auth.repository.js';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port.js';
import { RefreshTokenHasherPort } from '../../../domain/ports/out/refresh-token-hasher.port.js';
import { TokenPort } from '../../../domain/ports/out/token.port.js';
import { Auth } from '../../../domain/entities/auth.entity.js';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error.js';

describe('LoginService', () => {
  let authRepository: Mocked<AuthRepository>;
  let passwordHasher: Mocked<PasswordHasherPort>;
  let tokenPort: Mocked<TokenPort>;
  let refreshHasher: Mocked<RefreshTokenHasherPort>;
  let logger: Mocked<LoggerPort>;
  let service: LoginService;

  const dto = { email: 'admin@test.com', password: 'secret123' };
  const user = new Auth('user-id', dto.email, Role.Admin, 'hash', 'Admin');

  beforeEach(() => {
    authRepository = {
      findByEmail: vi.fn(),
      saveRefreshTokenHash: vi.fn(),
      rotateRefreshTokenHash: vi.fn(),
      Create: vi.fn(),
    };
    passwordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };
    tokenPort = {
      sign: vi.fn(),
      signRefresh: vi.fn(),
      verifyRefresh: vi.fn(),
      verify: vi.fn(),
    };
    refreshHasher = { hash: vi.fn().mockReturnValue('refresh-hash') };
    logger = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    service = new LoginService(authRepository, passwordHasher, tokenPort, refreshHasher, logger);
  });

  it('returns token, name and role when credentials are valid', async () => {
    authRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    tokenPort.sign.mockResolvedValue('jwt-token');
    tokenPort.signRefresh.mockResolvedValue('refresh-token');

    const result = await service.execute(dto);

    expect(passwordHasher.compare).toHaveBeenCalledWith('secret123', 'hash');
    expect(tokenPort.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: dto.email,
      role: Role.Admin,
    });
    expect(refreshHasher.hash).toHaveBeenCalledWith('refresh-token');
    expect(authRepository.saveRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      'refresh-hash',
    );
    expect(result).toEqual({
      accessToken: 'jwt-token',
      refreshToken: 'refresh-token',
      name: 'Admin',
      role: Role.Admin,
    });
  });

  it('returns null name when the user has none', async () => {
    authRepository.findByEmail.mockResolvedValue(
      new Auth('user-id', dto.email, Role.Customer, 'hash'),
    );
    passwordHasher.compare.mockResolvedValue(true);
    tokenPort.sign.mockResolvedValue('jwt-token');
    tokenPort.signRefresh.mockResolvedValue('refresh-token');

    const result = await service.execute(dto);

    expect(result.name).toBeNull();
  });

  it('throws InvalidCredentialsError when the user does not exist', async () => {
    authRepository.findByEmail.mockResolvedValue(null);

    await expect(service.execute(dto)).rejects.toThrow(InvalidCredentialsError);

    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenPort.sign).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });

  it('throws InvalidCredentialsError when the user has no password hash', async () => {
    authRepository.findByEmail.mockResolvedValue(
      new Auth('user-id', dto.email, Role.Admin),
    );

    await expect(service.execute(dto)).rejects.toThrow(InvalidCredentialsError);

    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenPort.sign).not.toHaveBeenCalled();
  });

  it('throws InvalidCredentialsError when the password does not match', async () => {
    authRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(service.execute(dto)).rejects.toThrow(InvalidCredentialsError);

    expect(tokenPort.sign).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });
});
