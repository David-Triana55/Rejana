import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly base = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  private readonly transactionStorage =
    new AsyncLocalStorage<Prisma.TransactionClient>();

  /**
   * Client that repositories must use. Inside `runInTransaction` it is the
   * transaction client, otherwise the regular one.
   */
  get client(): Prisma.TransactionClient {
    return this.transactionStorage.getStore() ?? this.base;
  }

  runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    if (this.transactionStorage.getStore()) {
      return work();
    }
    return this.base.$transaction((tx) =>
      this.transactionStorage.run(tx, work),
    );
  }

  async onModuleInit() {
    await this.base.$connect();
  }

  async onModuleDestroy() {
    await this.base.$disconnect();
  }
}
