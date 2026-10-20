import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port.js';
import { Role } from '../../../../../shared/domain/enums/role.js';
import { AuthRepository } from '../../../domain/ports/out/auth.repository.js';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port.js';
import { CreateUserService } from './create-user.service.js';

describe('CreateUserService', () => {
  let authRepository: Mocked<AuthRepository>;
  let passwordHasher: Mocked<PasswordHasherPort>;
  let logger: Mocked<LoggerPort>;
  let useCase: CreateUserService;

  beforeEach(() => {
    authRepository = {
      findByEmail: vi.fn(),
      Create: vi.fn(),
    };
    passwordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };
    logger = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    useCase = new CreateUserService(authRepository, passwordHasher, logger);
  });

  it('hashes the password and creates the user with the hash', async () => {
    passwordHasher.hash.mockResolvedValue('hashed-password');
    authRepository.Create.mockResolvedValue(undefined);

    const result = await useCase.execute('user@test.com', 'name user', Role.Admin);

    expect(passwordHasher.hash).toHaveBeenCalledWith(expect.any(String));
    expect(authRepository.Create).toHaveBeenCalledWith({
      id: expect.any(String),
      email: 'user@test.com',
      passwordHash: 'hashed-password',
      role: Role.Admin,
      name: 'name user',
    });
    expect(result).toEqual({ id: expect.any(String) });
    expect(logger.log).toHaveBeenCalled();
  });
});
