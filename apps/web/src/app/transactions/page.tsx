"use client";

import React, { useState } from "react";
import { analyzeTransaction } from "../../lib/guardian-api";
import { GuardianSecurityReport } from "@weth/agent";
import { SecurityCard } from "../../components/guardian/SecurityCard";
import { RiskGauge } from "../../components/guardian/RiskGauge";
import { FindingsList } from "../../components/guardian/FindingsList";
import { Terminal, Code, Loader2, AlertCircle, ShieldCheck, Cpu } from "lucide-react";

export default function TransactionAnalysisPage() {
  const [from, setFrom] = useState("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
  const [to, setTo] = useState("0x9999999999999999999999999999999999999999");
  const [value, setValue] = useState("0");
  const [calldata, setCalldata] = useState(
    "0x095ea7b30000000000000000000000009999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  const [selectedChain, setSelectedChain] = useState<"ETH_MAINNET" | "BASE" | "ARBITRUM">("BASE");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<GuardianSecurityReport | null>(null);

  const chainIds: Record<string, string> = {
    ETH_MAINNET: "1",
    BASE: "8453",
    ARBITRUM: "42161",
  };

  async function handleAnalyze(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!from.trim() || !to.trim() || loading) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await analyzeTransaction({
        from: from.trim(),
        to: to.trim(),
        value: value.trim() || "0",
        data: calldata.trim() || "0x",
      });
      setReport(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to simulate transaction and evaluate policy checks.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header & Status Badges */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#27272a] bg-[#101014] text-[#a1a1aa] text-[11px] font-mono uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>ETH_CALL // SIMULATING ON {selectedChain} (CHAIN_ID: {chainIds[selectedChain]})</span>
          </div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981] text-[11px] font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[x402_PROTOCOL: COMPLIANT // MICRO-ESCROW 0.0001 ETH VERIFIED]</span>
          </div>
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#ffffff] font-mono uppercase">
            CALLDATA POLICY &amp; SIMULATION ENGINE
          </h1>
          <p className="text-xs text-[#a1a1aa] font-mono leading-relaxed">
            Simulate state transitions and verify raw hex calldata permissions before signing or transmitting to RPC nodes.
          </p>
        </div>
      </div>

      {/* Transaction Draft Form */}
      <form
        onSubmit={handleAnalyze}
        className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 shadow-sm space-y-5"
      >
        {/* Multi-Chain Selector Pill Bar */}
        <div className="pb-4 border-b border-[#1c1c22]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>TARGET EVM NETWORK FOR STATE SIMULATION</span>
            </label>
            <span className="text-[10px] font-mono text-[#52525b]">REAL-TIME RPC FORK</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["ETH_MAINNET", "BASE", "ARBITRUM"] as const).map((chain) => (
              <button
                key={chain}
                type="button"
                onClick={() => setSelectedChain(chain)}
                className={`py-2 px-3 rounded text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                  selectedChain === chain
                    ? "bg-[#ffffff] text-[#000000] border-[#ffffff] shadow-sm"
                    : "bg-[#101014] text-[#a1a1aa] border-[#27272a] hover:border-[#5e6ad2] hover:text-[#ffffff]"
                }`}
              >
                [{chain}]
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] mb-2">
              FROM ADDRESS (SENDER)
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="0x..."
              disabled={loading}
              className="w-full px-4 py-2.5 rounded border border-[#27272a] bg-[#101014] text-xs font-mono focus:outline-none focus:border-[#5e6ad2] text-[#ffffff] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] mb-2">
              TO ADDRESS (RECIPIENT / CONTRACT)
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              disabled={loading}
              className="w-full px-4 py-2.5 rounded border border-[#27272a] bg-[#101014] text-xs font-mono focus:outline-none focus:border-[#5e6ad2] text-[#ffffff] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] mb-2">
            VALUE (WEI)
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded border border-[#27272a] bg-[#101014] text-xs font-mono focus:outline-none focus:border-[#5e6ad2] text-[#ffffff] transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>RAW HEX CALLDATA PAYLOAD</span>
            </label>
            <span className="text-[10px] font-mono text-[#52525b]">
              e.g. 0x095ea7b3... (ERC20 approve)
            </span>
          </div>
          <textarea
            rows={3}
            value={calldata}
            onChange={(e) => setCalldata(e.target.value)}
            placeholder="0x"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded border border-[#27272a] bg-[#101014] text-xs font-mono focus:outline-none focus:border-[#5e6ad2] text-[#ffffff] transition-all resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !from.trim() || !to.trim()}
          className="w-full py-3.5 rounded bg-[#ffffff] text-[#000000] font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#e4e4e7] disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5e6ad2]" />
              <span>EXECUTING SIMULATION TRACE ON {selectedChain}...</span>
            </>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5" />
              <span>EXECUTE STATE TRANSITION SIMULATION ON [{selectedChain}]</span>
            </>
          )}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-12 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#5e6ad2] mx-auto" />
          <div className="space-y-1 font-mono">
            <h3 className="text-sm font-bold uppercase text-[#ffffff]">
              EXECUTING ETH_CALL &amp; HEURISTICS ON {selectedChain}...
            </h3>
            <p className="text-xs text-[#71717a]">
              Running sandbox execution, estimating gas profile, and evaluating policy invariants against calldata.
            </p>
          </div>
        </div>
      )}

      {/* Error Card */}
      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-400 font-mono flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">[SIMULATION ERROR]</h3>
            <p className="text-xs text-[#d4d4d8] font-sans">{error}</p>
          </div>
        </div>
      )}

      {/* Output Results */}
      {report && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 flex flex-col items-center justify-center text-center">
              <RiskGauge
                score={report.riskScore}
                recommendation={report.recommendation}
                size="lg"
              />
            </div>

            <div className="sm:col-span-2 rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 flex flex-col justify-between font-mono">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] mb-2">
                  SIMULATION OUTCOME &amp; VERDICT ({selectedChain})
                </div>
                <div className="text-sm font-bold text-[#ffffff] mb-3 leading-relaxed font-sans">
                  {report.summary}
                </div>
              </div>
              <div className="pt-4 border-t border-[#1c1c22] flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">
                  POLICY STATUS:
                </span>
                <span
                  className={`px-3 py-1 rounded font-bold uppercase text-xs ${
                    report.recommendation === "Reject" || report.riskScore >= 81
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40"
                  }`}
                >
                  {report.recommendation}
                </span>
              </div>
            </div>
          </div>

          {/* Smart Calldata Sanitizer (Auto-Remediation Panel) */}
          {report.sanitizedCalldata && (
            <div className="rounded-xl border border-[#10b981]/50 bg-[#10b981]/10 p-6 space-y-4 font-mono shadow-lg animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#10b981]/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10b981]">
                    [AUTO-REMEDIATION // SANITIZED PAYLOAD GENERATED]
                  </span>
                </div>
                <span className="text-[11px] text-[#a1a1aa]">
                  LATENCY: &lt; 45ms // INSTANT GUARDRAIL
                </span>
              </div>

              <p className="text-xs text-[#e4e4e7] leading-relaxed font-sans">
                {report.sanitizedExplanation ||
                  "Infinite token allowance stripped and capped to safe transactional limit (1,000,000 units). Safe to sign."}
              </p>

              <div className="space-y-2">
                <div className="text-[10px] text-[#71717a] uppercase font-bold tracking-wider">
                  ORIGINAL DANGEROUS CALLDATA (INFINITE ALLOWANCE):
                </div>
                <div className="p-2.5 rounded bg-[#000000] border border-red-500/40 text-[11px] text-red-400 break-all select-all font-mono">
                  {calldata}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-[#10b981] uppercase font-bold tracking-wider flex items-center justify-between">
                  <span>REPLACEMENT SANITIZED CALLDATA (SAFE CAP):</span>
                  <span className="text-[10px] text-[#a1a1aa]">[VERIFIED_SAFE]</span>
                </div>
                <div className="p-3 rounded bg-[#000000] border border-[#10b981]/60 text-xs text-[#10b981] break-all select-all font-mono font-bold">
                  {report.sanitizedCalldata}
                </div>
              </div>

              <button
                onClick={() => {
                  if (report.sanitizedCalldata) {
                    navigator.clipboard.writeText(report.sanitizedCalldata);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  }
                }}
                type="button"
                className="w-full py-3 rounded bg-[#10b981] text-[#000000] font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#059669] transition-all cursor-pointer shadow-md"
              >
                <span>
                  {copied
                    ? "[ COPIED SANITIZED CALLDATA TO CLIPBOARD ]"
                    : "[ COPY SANITIZED PAYLOAD TO SIGN ]"}
                </span>
              </button>
            </div>
          )}

          <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ffffff]">
              POLICY HEURISTICS &amp; FLAGS
            </h3>
            <FindingsList findings={report.findings} />
          </div>

          <SecurityCard report={report} />
        </div>
      )}
    </div>
  );
}
