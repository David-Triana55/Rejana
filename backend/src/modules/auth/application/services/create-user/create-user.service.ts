import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  type AuthRepository,
} from '../../../domain/ports/out/auth.repository.js';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../../../domain/ports/out/password-hasher.port.js';
import {
  LOGGER_PORT,
  type LoggerPort,
} from '../../../../../shared/domain/ports/out/logger.port.js';
import { Auth } from '../../../domain/entities/auth.entity.js';
import { UserAlreadyExistsError } from '../../../domain/errors/user-already-exists.error.js';
import { randomUUID } from 'node:crypto';
import { RoleName } from '../../../../../shared/domain/enums/role.js';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(email: string, name: string, role: RoleName): Promise<{ id: string }> {

    const alreadyExists = await this.authRepository.findByEmail(email);

    if (alreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const randomPassword = this.generateRandomPassword();
    console.log("randomPassword: ",randomPassword);

    const passwordHash = await this.passwordHasher.hash(randomPassword);

    const user = new Auth(randomUUID(), email, role, passwordHash, name);


    await this.authRepository.Create(user);

    this.logger.log(`User ${user.id} created`, 'CreateUserUseCase');
    return { id: user.id };
  }

  private  generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
