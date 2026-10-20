import { Inject, Injectable } from '@nestjs/common';
import {
  LOGGER_PORT,
  type LoggerPort,
} from '../../../../../shared/domain/ports/out/logger.port.js';
import {
  UNIT_OF_WORK,
  type UnitOfWork,
} from '../../../../../shared/domain/ports/out/unit-of-work.port.js';
import { CreateUserService } from '../../../../auth/application/services/create-user/create-user.service.js';
import { Role } from '../../../../../shared/domain/enums/role.js';
import {
  ADMIN_REPOSITORY,
  type AdminRepository,
} from '../../../domain/ports/out/admin.repository.js';

@Injectable()
export class CreateAdminService {
  constructor(
    private readonly createUserService: CreateUserService,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(ADMIN_REPOSITORY) private readonly adminRepository: AdminRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(email: string ,name: string): Promise<{ id: string }> {
    const user = await this.unitOfWork.run(async () => {
      const created = await this.createUserService.execute(email,name, Role.Admin);
      await this.adminRepository.Create(created.id, email, name);
      return created;
    });

    this.logger.log(`User ${user.id} created`, 'CreateUserUseCase');
    return { id: user.id };
  }
}
