"use client";

import React from "react";
import { GuardianChat } from "../components/guardian/GuardianChat";
import { ThreatAlerts } from "../components/guardian/ThreatAlerts";
import { Terminal, Cpu, Activity, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

export default function GuardianCopilotPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Monochromatic Terminal Hero Banner */}
      <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#27272a] bg-[#101014] text-[#a1a1aa] text-[11px] font-mono uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>MIDNIGHT POLICY & THREAT ENGINE // ZERO-KEY RUNTIME</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ffffff]">
              Deterministic Pre-Sign Verification.
            </h1>
            <p className="text-sm text-[#a1a1aa] leading-relaxed font-mono">
              Execute multi-hop Neo4j threat graph traversal and compact_call state simulations before transmitting transactions to RPC nodes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded border border-[#27272a] bg-[#101014] hover:border-[#5e6ad2] text-[#ffffff] font-mono text-xs uppercase tracking-wider transition-all"
            >
              <span>Security Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two-Column Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Copilot Chat (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5e6ad2]" />
              <span>INTENT ROUTER // NATURAL LANGUAGE INTERFACE</span>
            </h2>
            <span className="text-[11px] font-mono text-[#52525b]">
              LOCAL AST &amp; REGEX HEURISTICS
            </span>
          </div>
          <GuardianChat />
        </div>

        {/* Right Side: Runtime Intelligence Feed (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#5e6ad2]" />
              <span>ACTIVE RUNTIME FEED &amp; THREAT GRAPH</span>
            </h2>
            <span className="text-[11px] font-mono text-[#52525b]">REAL-TIME</span>
          </div>

          {/* System Runtime Metrics Panel */}
          <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c1c22] pb-3">
              <span className="text-xs font-mono text-[#ffffff] uppercase font-bold">
                RUNTIME STATE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101014] border border-[#27272a] text-[#10b981]">
                [ONLINE]
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-[#52525b]">POLICY ENGINE</div>
                <div className="text-[#ffffff] font-semibold">DETERMINISTIC v2</div>
              </div>
              <div className="space-y-1">
                <div className="text-[#52525b]">GRAPH LATENCY</div>
                <div className="text-[#ffffff] font-semibold">14.2 ms</div>
              </div>
              <div className="space-y-1">
                <div className="text-[#52525b]">SIMULATOR TRACE</div>
                <div className="text-[#ffffff] font-semibold">MIDNIGHT_CALL ACTIVE</div>
              </div>
              <div className="space-y-1">
                <div className="text-[#52525b]">FAIL-SAFE CACHE</div>
                <div className="text-[#ffffff] font-semibold">IN-MEMORY LRU</div>
              </div>
            </div>
          </div>

          <ThreatAlerts />
        </div>
      </div>
    </div>
  );
}
