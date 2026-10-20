import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { CreateAdminService } from './create-admin.service.js';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port.js';
import { Role } from '../../../../../shared/domain/enums/role.js';
import { CreateUserService } from '../../../../auth/application/services/create-user/create-user.service.js';
import { AdminRepository } from '../../../domain/ports/out/admin.repository.js';
import { UnitOfWork } from '../../../../../shared/domain/ports/out/unit-of-work.port.js';

describe('CreateAdminService', () => {
  let createUserService: Mocked<Pick<CreateUserService, 'execute'>>;
  let adminRepository: Mocked<AdminRepository>;
  let logger: Mocked<LoggerPort>;
  let unitOfWork: Mocked<UnitOfWork>;
  let service: CreateAdminService;

  beforeEach(() => {
    createUserService = {
      execute: vi.fn(),
    };
    adminRepository = {
      Create: vi.fn(),
    };
    logger = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    unitOfWork = {
      run: vi.fn((work) => work()),
    } as unknown as Mocked<UnitOfWork>;
    service = new CreateAdminService(
      createUserService as unknown as CreateUserService,
      logger,
      adminRepository,
      unitOfWork,
    );
  });

  it('creates a user with the admin role and persists the admin with its id', async () => {
    createUserService.execute.mockResolvedValue({ id: 'user-id' });
    adminRepository.Create.mockResolvedValue(undefined);

    const result = await service.execute('admin@test.com', 'name admin');

    expect(createUserService.execute).toHaveBeenCalledWith(
      'admin@test.com',
      'name admin',
      Role.Admin,
    );
    expect(adminRepository.Create).toHaveBeenCalledWith(
      'user-id',
      'admin@test.com',
      'name admin',
    );
    expect(unitOfWork.run).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 'user-id' });
    expect(logger.log).toHaveBeenCalled();
  });

  it('does not persist the admin when user creation fails', async () => {
    createUserService.execute.mockRejectedValue(new Error('boom'));

    await expect(service.execute('admin@test.com', 'name admin')).rejects.toThrow('boom');

    expect(adminRepository.Create).not.toHaveBeenCalled();
  });
});
