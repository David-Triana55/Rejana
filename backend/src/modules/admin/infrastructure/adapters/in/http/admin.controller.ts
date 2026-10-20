import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAdminService } from '../../../../application/services/create-admin/create-admin.service.js';
import { AuthGuard } from '../../../../../auth/infrastructure/adapters/in/http/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../../../../shared/infrastructure/http/guards/roles.guard.js';
import { Roles } from '../../../../../../shared/infrastructure/http/decorators/roles.decorator.js';
import { Role } from '../../../../../../shared/domain/enums/role.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly createAdmin: CreateAdminService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async register(@Body() body: { email: string,  name: string }): Promise<{ id: string }> {
    return this.createAdmin.execute(body.email,body.name);
  }
}
