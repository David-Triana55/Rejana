import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from './prisma.service.js';

describe('PrismaService transactions', () => {
  const setup = () => {
    const service = new PrismaService();
    const base = (service as unknown as { base: { $transaction: unknown } })
      .base;
    const tx = { marker: 'tx' };
    const transaction = vi
      .spyOn(
        base as {
          $transaction: (
            fn: (tx: unknown) => Promise<unknown>,
          ) => Promise<unknown>;
        },
        '$transaction',
      )
      .mockImplementation((async (fn: (tx: unknown) => Promise<unknown>) =>
        fn(tx)) as never);
    return { service, base, tx, transaction };
  };

  it('exposes the regular client outside a transaction', () => {
    const { service, base } = setup();

    expect(service.client === base).toBe(true);
  });

  it('exposes the transaction client inside runInTransaction', async () => {
    const { service, base, tx } = setup();

    const inside = await service.runInTransaction(async () => service.client);

    expect(inside).toBe(tx);
    expect(service.client === base).toBe(true);
  });

  it('joins the active transaction when nested', async () => {
    const { service, transaction } = setup();

    await service.runInTransaction(() =>
      service.runInTransaction(async () => undefined),
    );

    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it('propagates errors so the transaction rolls back', async () => {
    const { service } = setup();

    await expect(
      service.runInTransaction(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });
});
