"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

export function ConnectMidnightWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // @ts-ignore - Midnight global injection
      if (typeof window !== "undefined" && window.midnight && window.midnight.mnLace) {
        // @ts-ignore
        const api = await window.midnight.mnLace.enable();
        const state = await api.state();
        setAddress(state.address);
      } else {
        alert("Lace wallet with Midnight integration not found! Please install the Lace Midnight extension.");
      }
    } catch (err) {
      console.error("Failed to connect to Lace wallet:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-1.5 h-[38px]">
        <Wallet className="w-4 h-4 text-[#a855f7]" />
        <span className="text-xs font-mono text-[#e4e4e7]">
          {address.slice(0, 8)}...{address.slice(-6)}
        </span>
      </div>
    );
  }

  return (
    <button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] hover:border-[#a855f7] transition-all text-[#e4e4e7] font-mono text-xs px-4 py-1.5 rounded-lg h-[38px] font-bold"
    >
      <Wallet className="w-4 h-4 text-[#a855f7]" />
      {isConnecting ? "Connecting..." : "Connect Lace"}
    </button>
  );
}
