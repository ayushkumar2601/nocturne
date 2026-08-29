import React from "react";
import { ShieldAlert, ArrowUpRight, Terminal } from "lucide-react";

export interface ThreatAlertItem {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  time?: string;
  target?: string;
}

const DEFAULT_ALERTS: ThreatAlertItem[] = [
  {
    id: "alert-1",
    title: "UNLIMITED APPROVAL DETECTED",
    description: "Spender contract retains spending permissions indefinitely over USDC allowance.",
    severity: "CRITICAL",
    time: "2M AGO",
    target: "0x095ea7b3...",
  },
  {
    id: "alert-2",
    title: "KNOWN PHISHING CLUSTER TRACE",
    description: "Multi-hop Neo4j graph trace connects target address to documented phishing cluster.",
    severity: "CRITICAL",
    time: "14M AGO",
    target: "0x0000...dead",
  },
  {
    id: "alert-3",
    title: "UNVERIFIED PROXY DELEGATION",
    description: "Bytecode verification mismatch and unverified proxy implementation delegation.",
    severity: "HIGH",
    time: "1H AGO",
    target: "0x9999...9999",
  },
];

interface ThreatAlertsProps {
  alerts?: ThreatAlertItem[];
}

export function ThreatAlerts({ alerts = DEFAULT_ALERTS }: ThreatAlertsProps) {
  return (
    <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1c1c22]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-[#ffffff]">
            NEO4J THREAT FEED &amp; ALERTS
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16161b] text-[#a1a1aa] border border-[#27272a] uppercase">
          LIVE_GRAPH
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {alerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#a1a1aa] font-mono border border-[#1c1c22] rounded bg-[#101014] flex items-center justify-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
            <span>[SYSTEM CLEAN // ZERO ACTIVE THREATS DETECTED]</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="group rounded border border-[#1c1c22] bg-[#101014] p-3.5 transition-all hover:border-[#5e6ad2] flex items-start gap-3"
            >
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 font-mono">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-red-400">
                    {alert.title}
                  </span>
                  {alert.time && (
                    <span className="text-[10px] text-[#71717a]">
                      {alert.time}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#d4d4d8] font-sans leading-relaxed">
                  {alert.description}
                </p>
                {alert.target && (
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#71717a] pt-2 border-t border-[#1c1c22]">
                    <span className="truncate max-w-[200px]">TARGET: {alert.target}</span>
                    <span className="inline-flex items-center gap-0.5 text-red-400 font-bold uppercase shrink-0">
                      [BLOCKED] <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
