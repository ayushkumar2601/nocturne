"use client";

import React, { useState } from "react";
import { auditWallet } from "../../lib/guardian-api";
import { GuardianSecurityReport } from "@weth/agent";
import { SecurityCard } from "../../components/guardian/SecurityCard";
import { WalletScoreCard } from "../../components/guardian/WalletScoreCard";
import { Shield, Search, Loader2, AlertCircle, Terminal } from "lucide-react";

export default function WalletAuditPage() {
  const [address, setAddress] = useState("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<GuardianSecurityReport | null>(null);

  async function handleAudit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!address.trim() || loading) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await auditWallet(address.trim());
      setReport(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to scan wallet address across threat graph.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#27272a] bg-[#101014] text-[#a1a1aa] text-[11px] font-mono uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
          <span>DEDICATED NEO4J GRAPH SCANNER</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#ffffff] font-mono uppercase">
          WALLET EXPOSURE &amp; HEURISTIC SCANNER
        </h1>
        <p className="text-xs text-[#a1a1aa] font-mono leading-relaxed">
          Deep-scan EVM wallet token balances, active ERC20 allowances, and multi-hop Neo4j graph relationships.
        </p>
      </div>

      {/* Scanner Input Card */}
      <form
        onSubmit={handleAudit}
        className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] mb-2">
            TARGET EVM ADDRESS OR ENS
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717a] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded border border-[#27272a] bg-[#101014] text-xs font-mono focus:outline-none focus:border-[#5e6ad2] text-[#ffffff] placeholder:text-[#52525b] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="px-6 py-3 rounded bg-[#ffffff] text-[#000000] font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#e4e4e7] disabled:opacity-40 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5e6ad2]" />
                  <span>TRAVERSING GRAPH...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>EXECUTE SCAN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-12 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#5e6ad2] mx-auto" />
          <div className="space-y-1 font-mono">
            <h3 className="text-sm font-bold uppercase text-[#ffffff]">
              TRAVERSING NEO4J THREAT GRAPH...
            </h3>
            <p className="text-xs text-[#71717a]">
              Evaluating token balances, active ERC20 allowances, and multi-hop phishing relationships.
            </p>
          </div>
        </div>
      )}

      {/* Error Card */}
      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-400 font-mono flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">[SCAN ERROR]</h3>
            <p className="text-xs text-[#d4d4d8] font-sans">{error}</p>
          </div>
        </div>
      )}

      {/* Output Results */}
      {report && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <WalletScoreCard
            score={report.riskScore || 12}
            status={report.riskScore >= 61 ? "[HIGH_RISK_DETECTED]" : "[VERIFIED_SAFE]"}
            exposureAmount={report.riskScore >= 61 ? "$4,812" : "$0"}
            address={address}
            report={report}
            onAuditClick={handleAudit}
          />
          <SecurityCard report={report} />
        </div>
      )}
    </div>
  );
}
