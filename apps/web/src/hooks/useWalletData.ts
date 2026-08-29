import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

const API_BASE = 'http://localhost:3004';

export function useWalletData(endpoint: string) {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: [endpoint, address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`${API_BASE}/wallet/${address}${endpoint}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    },
    enabled: isConnected && !!address,
    refetchInterval: 15000, // Refresh every 15s
  });
}
