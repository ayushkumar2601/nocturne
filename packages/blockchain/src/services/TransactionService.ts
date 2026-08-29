import { cacheGet, cacheSet } from '../client.js';
import { logger } from '@weth/shared';

export class TransactionService {
  static async getTransactions(address: string): Promise<any[]> {
    const cacheKey = `transactions:${address}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    if (!rpcUrl) {
      logger.warn('SEPOLIA_RPC_URL is not set. Using fallback transaction history.');
      const demoTxs = [
        {
          hash: '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
          from: address,
          to: '0x095ea7b300000000000000000000000099999999999999999999999999999999',
          value: 0,
          asset: 'USDC',
          category: 'erc20',
        },
        {
          hash: '0xdef4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          from: address,
          to: '0x00000000000000000000000000000000dead',
          value: 0.1,
          asset: 'ETH',
          category: 'external',
        },
      ];
      await cacheSet(cacheKey, 60, JSON.stringify(demoTxs));
      return demoTxs;
    }

    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromBlock: '0x0',
              toBlock: 'latest',
              fromAddress: address,
              category: ['external', 'erc20'],
              maxCount: '0x14', // Limit to 20
            }
          ],
          id: 1,
        }),
      });

      const data = (await response.json()) as any;
      const transfers = data?.result?.transfers || [];

      await cacheSet(cacheKey, 60, JSON.stringify(transfers));
      return transfers;
    } catch (err: any) {
      logger.error({ err, address }, 'Failed to fetch transaction history');
      return [];
    }
  }
}
