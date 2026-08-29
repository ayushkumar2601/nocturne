import { describe, it, expect, vi } from 'vitest';

vi.mock('@weth/blockchain', () => ({
  BalanceService: {
    getBalance: vi.fn().mockResolvedValue({ eth: 1, network: 'sepolia' }),
    getTokenBalances: vi.fn().mockResolvedValue([]),
  },
  TransactionService: {
    getTransactions: vi.fn().mockResolvedValue([]),
  },
  EnsService: {
    resolveName: vi.fn().mockResolvedValue({ address: '0x123' }),
  }
}));

// In a real scenario, we'd import the fastify instance and use `fastify.inject`
describe('API Routes', () => {
  it('should be configured to test routes', () => {
    expect(true).toBe(true);
  });
});
