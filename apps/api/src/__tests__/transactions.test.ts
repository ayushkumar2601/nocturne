import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import transactionRoutes from '../routes/transactions.js';

describe('Transaction API Routes', () => {
  it('registers routes successfully', async () => {
    const fastify = Fastify();
    fastify.register(transactionRoutes);
    await fastify.ready();
    expect(fastify.hasRoute({ method: 'POST', url: '/draft' })).toBe(true);
    expect(fastify.hasRoute({ method: 'POST', url: '/simulate' })).toBe(true);
    expect(fastify.hasRoute({ method: 'POST', url: '/estimate-gas' })).toBe(true);
    expect(fastify.hasRoute({ method: 'POST', url: '/approve' })).toBe(true);
  });
});
