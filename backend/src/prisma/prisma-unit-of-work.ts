import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../shared/domain/ports/out/unit-of-work.port.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  run<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.runInTransaction(work);
  }
}
