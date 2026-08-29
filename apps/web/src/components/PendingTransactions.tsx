'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAccount, useSendTransaction } from 'wagmi';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface PendingDraft {
  id: string;
  chain?: string;
  toAddress?: string;
  value?: string;
  data?: string;
  status?: string;
}

export function PendingTransactions() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync, isPending: isSigning } = useSendTransaction();
  const [approvedIds, setApprovedIds] = useState<Record<string, string>>({});

  const { data: drafts, refetch } = useQuery<PendingDraft[]>({
    queryKey: ['pending-drafts', address],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3004/transactions/pending/${address}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: isConnected && !!address,
    refetchInterval: 3000,
  });

  const broadcastMutation = useMutation({
    mutationFn: async ({ draftId, hash }: { draftId: string; hash: string }) => {
      const res = await fetch('http://localhost:3004/transactions/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId, signedTransaction: hash }),
      });
      if (!res.ok) throw new Error('Broadcast failed');
      return res.json();
    },
    onSuccess: (_, variables) => {
      setApprovedIds((prev) => ({ ...prev, [variables.draftId]: variables.hash }));
      refetch();
    },
  });

  const handleSign = async (draft: PendingDraft) => {
    if (!isConnected) {
      alert('Please connect your wallet (Phantom or MetaMask) using the Connect button at the top right before signing.');
      return;
    }
    
    // Warn if chain is Midnight (wallet signing not fully implemented for Midnight MVP on frontend)
    if (draft.chain === 'midnight') {
      alert('Midnight testnet signature request detected. Simulating wallet approval for demo purposes.');
      await broadcastMutation.mutateAsync({ draftId: draft.id, hash: '0x' + Array(64).fill('0').join('') });
      return;
    }

    try {
      const hash = await sendTransactionAsync({
        to: (draft.toAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        value: BigInt(draft.value || '0'),
        data: draft.data && draft.data !== '0x' ? (draft.data as `0x${string}`) : undefined,
      });
      await broadcastMutation.mutateAsync({ draftId: draft.id, hash });
    } catch (err: unknown) {
      console.error('Wallet signing error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Wallet signing error: ${msg}`);
    }
  };

  if (!drafts || drafts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-900 pb-3">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          Pending Signing Requests
        </h3>
        <span className="text-xs text-neutral-500">Requires human signature</span>
      </div>

      <div className="space-y-3">
        {drafts.map((draft: PendingDraft) => {
          const isSignedOnChain = !!approvedIds[draft.id] || draft.status === 'BROADCASTED' || draft.status === 'EXECUTED';
          const isAgentApproved = draft.status === 'APPROVED';
          const chainBadgeColor = draft.chain === 'midnight' ? 'bg-purple-500/10 border-purple-500/30 text-purple-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-500';

          return (
            <div
              key={draft.id}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    ID: {draft.id}
                  </span>
                  <span className={`px-2 py-0.5 border text-[10px] font-semibold uppercase ${chainBadgeColor}`}>
                    {draft.chain || 'ethereum'}
                  </span>
                  {isAgentApproved && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-semibold">
                      AI Policy: SAFE
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                  Transfer {draft.value} Wei &rarr;{' '}
                  <span className="font-mono text-xs">
                    {draft.toAddress?.slice(0, 8)}...{draft.toAddress?.slice(-6)}
                  </span>
                </div>
                <div className="text-xs text-neutral-500">
                  Drafted by AI Agent via MCP protocol
                </div>
              </div>

              <div className="shrink-0">
                {isSignedOnChain ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium">
                    <Check size={14} />
                    Signed &amp; Broadcasted
                  </div>
                ) : (
                  <button
                    onClick={() => handleSign(draft)}
                    disabled={isSigning || broadcastMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-none font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isSigning || broadcastMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    Sign with Wallet
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
