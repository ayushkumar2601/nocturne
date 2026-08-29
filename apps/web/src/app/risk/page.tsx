'use client';

import { useAccount } from 'wagmi';
import { useWalletData } from '../../hooks/useWalletData';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface RiskyApproval {
  contract?: string;
  reason?: string;
}

export default function RiskPage() {
  const { isConnected } = useAccount();
  const { data, isLoading } = useWalletData('/approvals');

  if (!isConnected) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500">
        Connect your wallet to analyze risk.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Risk Center
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Zero-trust security inspection for token allowances and contract interactions
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-neutral-500">
          Scanning blockchain for risky interactions...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 rounded-none space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-500" />
              Security Policy Enforcement
            </h3>
            <ul className="space-y-2">
              {data?.recommendations?.map((rec: string, i: number) => (
                <li key={i} className="text-xs text-neutral-600 dark:text-neutral-300">
                  &bull; {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Inspected Contracts
            </h3>

            {(!data?.riskyApprovals || data.riskyApprovals.length === 0) && (
              <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-none text-center text-xs text-neutral-500">
                No high-risk allowances or suspicious contract interactions detected.
              </div>
            )}

            {data?.riskyApprovals?.map((risk: RiskyApproval, i: number) => (
              <div
                key={i}
                className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 rounded-none flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    {risk.contract}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">{risk.reason}</div>
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${risk.contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
