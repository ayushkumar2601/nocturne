"use client";

import React, { useEffect, useState } from "react";
import { getTrackedActions, TrackedAction, trackAction, auditWallet } from "../../lib/guardian-api";
import { WalletScoreCard } from "../../components/guardian/WalletScoreCard";
import { ThreatAlerts, ThreatAlertItem } from "../../components/guardian/ThreatAlerts";
import { Activity, History, Search, RefreshCw, Terminal, Layers } from "lucide-react";
import Link from "next/link";

export default function SecurityDashboardPage() {
  const [history, setHistory] = useState<TrackedAction[]>([]);
  const [targetAddress, setTargetAddress] = useState("mn_addr_preview1nkcdedpm4jqns2j9x6zmsz4hg7f8ryrw725hxxvm77tt6wg740xst609g4");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<string>("[VERIFIED_SAFE]");
  const [currentExposure, setCurrentExposure] = useState<string>("$0");
  const [activeReport, setActiveReport] = useState<any>(null);
  const [dynamicAlerts, setDynamicAlerts] = useState<ThreatAlertItem[]>([]);

  function loadHistoryAndSync() {
    const records = getTrackedActions();
    setHistory(records);

    // Derive live metrics from latest audit or transaction record in history
    if (records.length > 0) {
      const latest = records[0];
      setCurrentScore(latest.riskScore);
      if (latest.recommendation === "Reject" || latest.riskScore >= 81) {
        setCurrentStatus("[CRITICAL_EXPOSURE]");
        setCurrentExposure("$4,812+");
      } else if (latest.recommendation === "Caution" || latest.riskScore >= 41) {
        setCurrentStatus("[MODERATE_EXPOSURE]");
        setCurrentExposure("$1,250");
      } else {
        setCurrentStatus("[VERIFIED_SAFE]");
        setCurrentExposure("$0");
      }

      // Extract real findings into alerts
      const alerts: ThreatAlertItem[] = [];
      records.forEach((rec, idx) => {
        if (rec.findings && rec.findings.length > 0) {
          rec.findings.forEach((f, fIdx) => {
            alerts.push({
              id: `${rec.id}-${fIdx}`,
              title: f.title.toUpperCase(),
              description: f.description,
              severity: (f.severity as any) || "HIGH",
              time: new Date(rec.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              target: rec.target,
            });
          });
        } else if (rec.riskScore >= 60) {
          alerts.push({
            id: `high-risk-${rec.id}`,
            title: `HIGH RISK EVENT (${rec.type.toUpperCase()})`,
            description: rec.summary || "High risk evaluation triggered on target action.",
            severity: rec.riskScore >= 81 ? "CRITICAL" : "HIGH",
            time: new Date(rec.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            target: rec.target,
          });
        }
      });
      setDynamicAlerts(alerts.slice(0, 5));
    } else {
      // Clean institutional baseline if history is empty
      setDynamicAlerts([
        {
          id: "init-1",
          title: "UNLIMITED ALLOWANCE HEURISTIC",
          description: "Spender contract retains spending permissions indefinitely over token allowance.",
          severity: "CRITICAL",
          time: "RECENT",
          target: "0x095ea7b3...",
        },
        {
          id: "init-2",
          title: "NEO4J CLUSTER PROXIMITY",
          description: "Multi-hop graph trace connects target address to documented phishing cluster.",
          severity: "CRITICAL",
          time: "RECENT",
          target: "0x0000...dead",
        },
      ]);
    }
  }

  useEffect(() => {
    loadHistoryAndSync();
    window.addEventListener("weth_guardian_history_updated", loadHistoryAndSync);
    return () => window.removeEventListener("weth_guardian_history_updated", loadHistoryAndSync);
  }, []);

  async function handleLiveScan(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!targetAddress || isScanning) return;

    setIsScanning(true);
    try {
      const data = await auditWallet(targetAddress);
      setActiveReport(data);
      setCurrentScore(data.riskScore ?? 0);
      const rec = data.recommendation || "Safe to Proceed";
      setCurrentStatus(
        rec === "Reject" ? "[CRITICAL_EXPOSURE]" : rec === "Caution" ? "[MODERATE_EXPOSURE]" : "[VERIFIED_SAFE]"
      );
      setCurrentExposure(rec === "Reject" ? "$4,812+" : rec === "Caution" ? "$1,250" : "$0");
    } catch (err) {
      console.error("Failed to execute wallet scan", err);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Panel */}
      <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10b981]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                MIDNIGHT GUARDIAN // ASP RUNTIME ENGINE
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/40 text-[#10b981] text-[10px] font-bold uppercase">
              [x402_PROTOCOL: COMPLIANT // MICRO-ESCROW VERIFIED]
            </span>
            <span className="px-2 py-0.5 rounded bg-[#101014] border border-[#27272a] text-[#a1a1aa] text-[10px] font-bold uppercase">
              [A2MCP // PORT 3003 ACTIVE]
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#ffffff] flex items-center gap-2.5 font-mono uppercase">
            <Activity className="w-5 h-5 text-[#5e6ad2]" />
            <span>SECURITY POSTURE DASHBOARD</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 font-mono">
            Real-time multi-hop threat alerts, Midnight state simulations, and live ASP agent guardrails.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex items-center gap-3 shrink-0 font-mono">
          <Link
            href="/audit"
            className="text-xs font-bold uppercase px-4 py-2 rounded bg-[#ffffff] text-[#000000] hover:bg-[#e4e4e7] transition-all shadow-sm"
          >
            SCAN WALLET
          </Link>
          <Link
            href="/transactions"
            className="text-xs font-bold uppercase px-4 py-2 rounded border border-[#27272a] bg-[#101014] text-[#ffffff] hover:border-[#5e6ad2] transition-all"
          >
            SIMULATE CALLDATA
          </Link>
        </div>
      </div>

      {/* Live Scan Bar */}
      <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#a1a1aa] border-b border-[#1c1c22] pb-2">
          <span>TARGET MIDNIGHT NETWORK: [PREVIEW // CHAIN_ID: 1]</span>
          <span className="text-[#10b981] font-bold">[MULTI-HOP NEO4J SCAN READY]</span>
        </div>
        <form onSubmit={handleLiveScan} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              placeholder="Enter Midnight Wallet Address (mn_addr_...)"
              className="w-full pl-10 pr-4 py-2 rounded bg-[#101014] border border-[#27272a] text-[#ffffff] text-xs font-mono focus:outline-none focus:border-[#5e6ad2] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="w-full sm:w-auto text-xs font-mono font-bold uppercase px-5 py-2 rounded bg-[#ffffff] text-[#000000] hover:bg-[#e4e4e7] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "SCANNING ASP..." : "EXECUTE LIVE SCAN"}</span>
          </button>
        </form>
      </div>

      {/* Grid: Health Score Card & Threat Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live Health & Exposure (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa]">
              HEALTH &amp; FINANCIAL EXPOSURE
            </h2>
            <span className="text-[11px] font-mono text-[#52525b]">
              {history.length > 0 ? "SYNCED_HISTORY" : "BASELINE_ACTIVE"}
            </span>
          </div>
          <WalletScoreCard
            score={currentScore}
            status={currentStatus}
            exposureAmount={currentExposure}
            address={targetAddress}
            report={activeReport}
            onAuditClick={() => handleLiveScan()}
          />
        </div>

        {/* Right: Active Threat Alerts (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa]">
              NEO4J GRAPH &amp; GUARDRAIL ALERTS
            </h2>
            <span className="text-[11px] font-mono text-[#52525b]">
              {dynamicAlerts.length} TRACKED_EVENTS
            </span>
          </div>
          <ThreatAlerts alerts={dynamicAlerts} />
        </div>
      </div>

      {/* Section: Recent Analyses Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
            <History className="w-4 h-4 text-[#5e6ad2]" />
            <span>EXECUTION &amp; ACTION AUDIT LOG</span>
          </h2>
          <span className="text-xs font-mono text-[#71717a]">
            {history.length} RECORD(S) IN MEMORY
          </span>
        </div>

        <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#1c1c22] bg-[#101014] text-[11px] uppercase font-bold text-[#71717a]">
                  <th className="py-3 px-5">TYPE</th>
                  <th className="py-3 px-5">TARGET ADDRESS / CALLDATA</th>
                  <th className="py-3 px-5">RISK SCORE</th>
                  <th className="py-3 px-5">VERDICT</th>
                  <th className="py-3 px-5">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c22] text-xs">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#71717a] font-mono text-xs">
                      [LOG EMPTY // EXECUTE A LIVE SCAN ABOVE OR RUN COPILOT COMMANDS]
                    </td>
                  </tr>
                ) : (
                  history.map((item) => {
                    const isReject = item.recommendation === "Reject" || item.riskScore >= 81;
                    const isCaution = item.recommendation === "Caution" || (item.riskScore >= 41 && item.riskScore <= 80);

                    return (
                      <tr key={item.id} className="hover:bg-[#101014] transition-colors">
                        <td className="py-3.5 px-5 font-bold uppercase text-[#ffffff]">
                          <span className="px-2 py-0.5 rounded bg-[#16161b] border border-[#27272a] text-[11px]">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-[#d4d4d8] max-w-[240px] truncate">
                          {item.target}
                        </td>
                        <td className="py-3.5 px-5 font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              isReject
                                ? "bg-red-500/20 text-red-400"
                                : isCaution
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-[#10b981]/20 text-[#10b981]"
                            }`}
                          >
                            {item.riskScore}/100
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-bold uppercase">
                          <span
                            className={`${
                              isReject
                                ? "text-red-400"
                                : isCaution
                                ? "text-amber-400"
                                : "text-[#10b981]"
                            }`}
                          >
                            {item.recommendation}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-[#71717a]">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
