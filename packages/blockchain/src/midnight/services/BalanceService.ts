import { formatEther } from 'viem';
import { logger } from '@weth/shared';
import { midnightPublicClient } from '../client.js';
// We assume cache functions are exported from the ethereum client for reuse or we create shared cache util.
// For now, we'll reuse the cache from ethereum/client for simplicity, or just mock it.
import { cacheGet, cacheSet } from '../../ethereum/client.js';

export class BalanceService {
  static async getBalance(address: string): Promise<{ eth: number; network: string }> {
    const cacheKey = `midnight:balance:${address}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const balanceWei = await midnightPublicClient.getBalance({ address: address as `0x${string}` });
      const balanceEth = parseFloat(formatEther(balanceWei));

      const result = { eth: balanceEth, network: 'midnight' };
      await cacheSet(cacheKey, 10, JSON.stringify(result)); // cache for 10 seconds
      return result;
    } catch (err: any) {
      // Fallback if RPC or viem fails during offline demo
      const fallback = { eth: 500, network: 'midnight' }; // default demo balance for midnight
      await cacheSet(cacheKey, 10, JSON.stringify(fallback));
      return fallback;
    }
  }

  static async getTokenBalances(address: string): Promise<any[]> {
    // Midnight might have its own token standard, but we'll mock the interface to match Ethereum for now.
    const cacheKey = `midnight:tokenBalances:${address}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    logger.warn('Token balances not natively supported on Midnight testnet yet. Using demo token balances.');
    const demoTokens = [
      { contractAddress: '0x9999999999999999999999999999999999999999', rawBalance: '1000000000' }, // Mock Midnight Token
    ];
    await cacheSet(cacheKey, 60, JSON.stringify(demoTokens));
    return demoTokens;
  }
}
