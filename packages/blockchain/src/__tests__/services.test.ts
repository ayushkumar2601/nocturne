import { describe, it, expect, vi } from 'vitest';
import { BalanceService } from '../ethereum/services/BalanceService.js';
import { TransactionService } from '../ethereum/services/TransactionService.js';
import { EnsService } from '../ethereum/services/EnsService.js';

// Mock dependencies
vi.mock('../ethereum/client.js', () => ({
  viemClient: {
    getBalance: vi.fn().mockResolvedValue(1000000000000000000n), // 1 ETH
    getEnsAddress: vi.fn().mockResolvedValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
  },
  redis: {
    get: vi.fn().mockResolvedValue(null),
    setex: vi.fn().mockResolvedValue('OK'),
  },
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn().mockResolvedValue(undefined),
}));

describe('Blockchain Services', () => {
  it('BalanceService should get balance', async () => {
    const result = await BalanceService.getBalance('0x123');
    expect(result.eth).toBe(1);
    expect(result.network).toBe('sepolia');
  });

  it('BalanceService should return token balances (demo fallback or real)', async () => {
    const result = await BalanceService.getTokenBalances('0x123');
    expect(Array.isArray(result)).toBe(true);
  });

  it('TransactionService should return transactions (demo fallback or real)', async () => {
    const result = await TransactionService.getTransactions('0x123');
    expect(Array.isArray(result)).toBe(true);
  });

  it('EnsService should resolve name', async () => {
    const result = await EnsService.resolveName('vitalik.eth');
    expect(result.address).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });
});
