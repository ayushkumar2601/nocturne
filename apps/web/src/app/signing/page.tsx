'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from 'lucide-react';
import { PendingTransactions } from '../../components/PendingTransactions';

export default function SigningPage() {
  const { address, isConnected } = useAccount();
  const [showSecret, setShowSecret] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [activeChain, setActiveChain] = useState<'ethereum' | 'sepolia'>('sepolia');
  const [wallets, setWallets] = useState([
    {
      id: 1,
      name: 'Wallet 1',
      publicKey: address || '0x71C...E39a',
      privateKey: '0x4a82...9e21...d8c3...b17f...4a82...9e21...d8c3...b17f',
    },
  ]);
  const [demoApproved, setDemoApproved] = useState(false);

  const handleAddWallet = () => {
    const nextId = wallets.length + 1;
    setWallets([
      ...wallets,
      {
        id: nextId,
        name: `Wallet ${nextId}`,
        publicKey: address || `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        privateKey: `0x${Math.random().toString(16).substring(2, 34)}...`,
      },
    ]);
  };

  const handleClearWallets = () => {
    setWallets([]);
  };

  const handleRemoveWallet = (id: number) => {
    setWallets(wallets.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Chain selector tabs inspired by Kosh v1.3 */}
      <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-900 pb-2">
        <button
          onClick={() => setActiveChain('sepolia')}
          className={`text-sm font-medium pb-2 -mb-2 border-b-2 transition-colors ${
            activeChain === 'sepolia'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Sepolia
        </button>
        <button
          onClick={() => setActiveChain('ethereum')}
          className={`text-sm font-medium pb-2 -mb-2 border-b-2 transition-colors ${
            activeChain === 'ethereum'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Ethereum
        </button>
      </div>

      {/* Expandable Secret Phrase Section with sharp corners */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-none overflow-hidden">
        <button
          onClick={() => setShowSecret(!showSecret)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
        >
          <span className="text-lg font-semibold text-neutral-900 dark:text-white">
            Your Secret Phrase
          </span>
          {showSecret ? (
            <ChevronUp className="w-5 h-5 text-neutral-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-500" />
          )}
        </button>
        {showSecret && (
          <div className="px-5 pb-5 pt-1 border-t border-neutral-200 dark:border-neutral-900 text-sm font-mono text-neutral-600 dark:text-neutral-300">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {[
                'abandon',
                'amount',
                'agent',
                'ethereum',
                'policy',
                'secure',
                'sandwich',
                'sandbox',
                'network',
                'sepolia',
                'sign',
                'verify',
              ].map((word, i) => (
                <div
                  key={word}
                  className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none px-3 py-2 text-xs flex items-center gap-2"
                >
                  <span className="text-neutral-400 select-none">{i + 1}.</span>
                  <span>{word}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              Never share your recovery phrase with anyone. AI agents do not have access to this key.
            </p>
          </div>
        )}
      </div>

      {/* Wallet Section Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {activeChain === 'sepolia' ? 'Sepolia Wallet' : 'Ethereum Wallet'}
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddWallet}
            className="bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 px-4 py-2 rounded-none font-medium text-xs transition-opacity"
          >
            Add Wallet
          </button>
          <button
            onClick={handleClearWallets}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-none font-medium text-xs transition-colors"
          >
            Clear Wallets
          </button>
        </div>
      </div>

      {/* Wallet Cards List with sharp corners */}
      <div className="space-y-4">
        {wallets.length === 0 ? (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-none p-10 text-center text-sm text-neutral-500">
            No wallets configured. Click &ldquo;Add Wallet&rdquo; above to create or connect one.
          </div>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-none p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {wallet.name}
                </span>
                <button
                  onClick={() => handleRemoveWallet(wallet.id)}
                  className="text-red-500 hover:text-red-400 transition-colors p-1"
                  title="Remove wallet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Nested dark monochrome wallet box exactly matching Kosh v1.3 */}
              <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 rounded-none p-4 space-y-4">
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                    Public Key
                  </div>
                  <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 break-all">
                    {isConnected && address ? address : wallet.publicKey}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                    Private Key
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 overflow-hidden truncate">
                      {showPrivateKey
                        ? wallet.privateKey
                        : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white shrink-0 transition-colors"
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live & Interactive Signing Section */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Human-in-the-Loop Signing Console
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            All AI Agent drafts require explicit signature approval before execution.
          </p>
        </div>

        {/* Live Pending Transactions component */}
        <PendingTransactions />

        {/* Demo Signing Row with sharp corners */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-neutral-500">
              DRAFT-TEST #9011 &bull; Sepolia Agent Transfer (Demo Preview)
            </div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
              Send 0.015 ETH to 0x4B20...91A8
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Simulated Gas: 21,000 &bull; Risk Check: Passed
            </div>
          </div>

          <div className="shrink-0">
            {demoApproved ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium">
                Sign Approved
              </div>
            ) : (
              <button
                onClick={() => setDemoApproved(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-none font-medium text-xs transition-colors cursor-pointer"
              >
                Approve &amp; Sign
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
