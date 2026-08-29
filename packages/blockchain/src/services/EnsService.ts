import { viemClient, redis } from '../client.js';
import { normalize } from 'viem/ens';

export class EnsService {
  static async resolveName(name: string): Promise<{ address: string | null }> {
    const cacheKey = `ens:${name}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // ENS is usually mainnet, viem requires mainnet for standard ens lookup.
    // We will attempt on Sepolia (if configured) or fallback to null for this phase.
    try {
      const address = await viemClient.getEnsAddress({
        name: normalize(name),
      });
      const result = { address };
      await redis.setex(cacheKey, 60, JSON.stringify(result)); // cache for 60 seconds
      return result;
    } catch (e) {
      return { address: null };
    }
  }
}
