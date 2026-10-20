import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ADMIN_REPOSITORY } from './domain/ports/out/admin.repository.js';
import { CreateAdminService } from './application/services/create-admin/create-admin.service.js';
import { AdminController } from './infrastructure/adapters/in/http/admin.controller.js';
import { PrismaAdminRepository } from './infrastructure/adapters/out/persistence/prisma-admin.repository.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [
    CreateAdminService,
    { provide: ADMIN_REPOSITORY, useClass: PrismaAdminRepository },
  ],
})
export class AdminModule {}
