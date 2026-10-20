import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PASSWORD_HASHER } from './domain/ports/out/password-hasher.port.js';
import { AUTH_REPOSITORY } from './domain/ports/out/auth.repository.js';
import { TOKEN_PORT } from './domain/ports/out/token.port.js';
import { AuthController } from './infrastructure/adapters/in/http/auth.controller.js';
import { PrismaAuthRepository } from './infrastructure/adapters/out/persistence/prisma-auth.repository.js';
import { BcryptPasswordHasherAdapter } from './infrastructure/adapters/out/hashing/bcrypt-password-hasher.adapter.js';
import { JwtTokenAdapter } from './infrastructure/adapters/out/token/jwt-token.adapter.js';
import { CreateUserService } from './application/services/create-user/create-user.service.js';
import { LoginService } from './application/services/login/login.service.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    CreateUserService,
    LoginService,
    { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasherAdapter },
    { provide: TOKEN_PORT, useClass: JwtTokenAdapter },
  ],
  exports: [TOKEN_PORT, CreateUserService],
})
export class AuthModule {}
