import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../prisma/prisma.service.js';
import { AuthRepository } from '../../../../domain/ports/out/auth.repository.js';
import { Auth } from '../../../../domain/entities/auth.entity.js';
import type { RoleName } from '../../../../../../shared/domain/enums/role.js';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Auth | null> {
    const auth = await this.prisma.client.auth.findFirst({
      where: { email },
      include: { role: true, admin: true, employee: true },
    });

    if (!auth) {
      return null;
    }

    return new Auth(
      auth.id,
      auth.email,
      auth.role.name as RoleName,
      auth.passwordHash ?? undefined,
      auth.admin?.name ?? auth.employee?.name ?? null,
    );
  }

  async saveRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await this.prisma.client.auth.update({
      where: { id },
      data: { refreshTokenHash: hash },
    });
  }

  async rotateRefreshTokenHash(
    id: string,
    current: string,
    next: string,
  ): Promise<boolean> {
    const { count } = await this.prisma.client.auth.updateMany({
      where: { id, refreshTokenHash: current },
      data: { refreshTokenHash: next },
    });
    return count === 1;
  }

  async Create(auth: Auth): Promise<void> {
    await this.prisma.client.auth.create({
      data: {
        id: auth.id,
        email: auth.email,
        role: { connect: { name: auth.role } },
        passwordHash: auth.passwordHash,
      },
    });
  }
}
