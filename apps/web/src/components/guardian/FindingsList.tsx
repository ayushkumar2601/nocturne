import React from "react";
import { GuardianFinding } from "@weth/agent";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Terminal } from "lucide-react";

interface FindingsListProps {
  findings: GuardianFinding[];
  compact?: boolean;
}

export function FindingsList({ findings, compact = false }: FindingsListProps) {
  if (!findings || findings.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] py-2">
        <Terminal className="w-3.5 h-3.5 shrink-0" />
        <span>[POLICY VERIFIED // ZERO RISKS DETECTED]</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-2.5"}`}>
      {findings.map((f, i) => {
        let icon = <Info className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />;
        let badgeStyle = "bg-[#101014] text-[#d4d4d8] border-[#1c1c22]";
        let severityTag = `[INFO // ${f.severity}]`;

        if (f.severity === "CRITICAL" || f.severity === "HIGH") {
          icon = <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />;
          badgeStyle = "bg-[#101014] text-red-400 border-red-500/40";
          severityTag = `[FLAG // ${f.severity}]`;
        } else if (f.severity === "MEDIUM") {
          icon = <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />;
          badgeStyle = "bg-[#101014] text-orange-400 border-orange-500/40";
          severityTag = `[WARN // ${f.severity}]`;
        }

        return (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded border font-mono transition-colors ${badgeStyle}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ffffff] truncate">
                  {f.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  {severityTag}
                </span>
              </div>
              <p className={`text-xs ${compact ? "line-clamp-2" : ""} text-[#a1a1aa] font-sans leading-relaxed font-normal`}>
                {f.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
