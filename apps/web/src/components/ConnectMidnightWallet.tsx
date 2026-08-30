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
        console.warn("window.midnight.mnLace not found. Lace extension might be lagging.");
        const fallbackAddress = prompt(
          "Lace extension API not detected (it might be lagging/blank). \n\nFor hackathon demo purposes, you can paste your Midnight address (mn_addr_...) here to bypass:"
        );
        if (fallbackAddress && fallbackAddress.startsWith("mn_addr")) {
          setAddress(fallbackAddress);
        } else if (fallbackAddress) {
          alert("Invalid address format. Must start with mn_addr");
        }
      }
    } catch (err) {
      console.error("Failed to connect to Lace wallet:", err);
      alert("Failed to connect to Lace. Check console for details.");
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
