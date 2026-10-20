import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../../../../domain/ports/out/admin.repository.js';
import { PrismaService } from '../../../../../../prisma/prisma.service.js';

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async Create(id: string, name: string): Promise<void> {
    await this.prisma.client.admin.create({ data: { id, name } });
  }
}
