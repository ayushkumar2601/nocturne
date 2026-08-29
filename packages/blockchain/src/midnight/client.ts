import { createPublicClient, http, PublicClient } from 'viem';
import { logger } from '@weth/shared';

// Midnight uses a custom RPC URL and chain ID.
// For now, we mock the viem client with a custom network since Midnight isn't natively in viem chains yet.
export const midnightChain = {
  id: Number(process.env.MIDNIGHT_CHAIN_ID || 8888),
  name: 'Midnight Testnet',
  network: 'midnight',
  nativeCurrency: {
    decimals: 18,
    name: 'Midnight',
    symbol: 'NIGHT',
  },
  rpcUrls: {
    default: { http: [process.env.MIDNIGHT_RPC_URL || 'https://rpc.midnight.network'] },
    public: { http: [process.env.MIDNIGHT_RPC_URL || 'https://rpc.midnight.network'] },
  },
};

export const midnightPublicClient: PublicClient = createPublicClient({
  chain: midnightChain,
  transport: http(),
}) as PublicClient;
