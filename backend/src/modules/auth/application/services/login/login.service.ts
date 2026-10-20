import { Inject, Injectable } from "@nestjs/common";
import { AUTH_REPOSITORY, type AuthRepository } from "../../../domain/ports/out/auth.repository.js";
import { PASSWORD_HASHER,type PasswordHasherPort } from "../../../domain/ports/out/password-hasher.port.js";
import { TOKEN_PORT, type TokenPort } from "../../../domain/ports/out/token.port.js";
import { LOGGER_PORT, type LoggerPort } from "../../../../../shared/domain/ports/out/logger.port.js";
import { LoginDto } from "../../dto/login.dto.js";
import { LoginResponse } from "../../dto/login-response.dto.js";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials.error.js";

@Injectable()
export class LoginService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: AuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_PORT) private readonly tokenPort: TokenPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.authRepo.findByEmail(dto.email);

    const passwordHash = user?.passwordHash;

    if (
      !user ||
      !passwordHash ||
      !(await this.passwordHasher.compare(dto.password, passwordHash))
    ) {
      this.logger.warn(`Failed login attempt for ${dto.email}`, 'LoginUseCase');
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenPort.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    this.logger.log(`User ${user.id} logged in`, 'LoginUseCase');

    return {
      accessToken: accessToken,
      name: user.name ?? null,
      role: user.role,
    };
  }
}
