'use client';

import { useAccount } from 'wagmi';
import { useWalletData } from '../../hooks/useWalletData';
import { CircleDollarSign } from 'lucide-react';

interface TokenBalance {
  contractAddress?: string;
  rawBalance?: string;
}

export default function PortfolioPage() {
  const { isConnected } = useAccount();
  const { data, isLoading } = useWalletData('/tokens');

  if (!isConnected) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500">
        Connect your wallet to view your portfolio.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Asset Portfolio
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Verified Sepolia token balances read via zero-trust indexer
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-neutral-500">Loading token balances...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(!data?.tokens || data.tokens.length === 0) && (
            <div className="col-span-full py-12 border border-neutral-200 dark:border-neutral-800 border-dashed rounded-none text-center text-xs text-neutral-500">
              No ERC20 tokens found in this wallet.
            </div>
          )}

          {data?.tokens?.map((token: TokenBalance, i: number) => (
            <div
              key={i}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 rounded-none flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-900 rounded-none flex items-center justify-center shrink-0">
                <CircleDollarSign className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs font-mono text-neutral-500 truncate mb-0.5">
                  {token.contractAddress}
                </div>
                <div className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white truncate">
                  {token.rawBalance}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
