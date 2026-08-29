import React from "react";
import { GuardianSecurityReport, GuardianRecommendation } from "@weth/agent";
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Terminal } from "lucide-react";
import { FindingsList } from "./FindingsList";

interface SecurityCardProps {
  report: GuardianSecurityReport;
  className?: string;
}

export function getRiskColorStyles(riskScore: number, recommendation?: GuardianRecommendation) {
  const safetyScore = Math.max(0, Math.min(100, 100 - riskScore));
  if (recommendation === "Reject" || riskScore >= 81 || safetyScore <= 19) {
    return {
      bg: "bg-[#0a0a0c] border-red-500/50",
      border: "border-red-500/50",
      text: "text-red-400 font-mono",
      badgeBg: "bg-[#16161b] text-red-400 border border-red-500/40",
      label: "[CRITICAL // REJECT]",
      icon: <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />,
      safetyScore,
    };
  }
  if (riskScore >= 61) {
    return {
      bg: "bg-[#0a0a0c] border-orange-500/50",
      border: "border-orange-500/50",
      text: "text-orange-400 font-mono",
      badgeBg: "bg-[#16161b] text-orange-400 border border-orange-500/40",
      label: "[HIGH_RISK]",
      icon: <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />,
      safetyScore,
    };
  }
  if (recommendation === "Caution" || (riskScore >= 41 && riskScore <= 80) || (safetyScore >= 20 && safetyScore <= 59)) {
    return {
      bg: "bg-[#0a0a0c] border-amber-500/50",
      border: "border-amber-500/50",
      text: "text-amber-400 font-mono",
      badgeBg: "bg-[#16161b] text-amber-400 border border-amber-500/40",
      label: "[MODERATE // CAUTION]",
      icon: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
      safetyScore,
    };
  }
  return {
    bg: "bg-[#0a0a0c] border-[#10b981]/40",
    border: "border-[#10b981]/40",
    text: "text-[#10b981] font-mono",
    badgeBg: "bg-[#16161b] text-[#10b981] border border-[#10b981]/40",
    label: "[VERIFIED_SAFE // APPROVE]",
    icon: <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />,
    safetyScore,
  };
}

export function SecurityCard({ report, className = "" }: SecurityCardProps) {
  const styles = getRiskColorStyles(report.riskScore, report.recommendation);

  return (
    <div
      className={`rounded-xl border p-5 transition-all shadow-md ${styles.bg} ${styles.border} ${className}`}
    >
      {/* Top: Header badge and risk score */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1c1c22] gap-3">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          {styles.icon}
          <span className={`text-xs uppercase tracking-wider ${styles.text}`}>
            {report.riskScore >= 61 ? "[HIGH_RISK_DETECTED]" : report.riskScore >= 41 ? "[CAUTION_REQUIRED]" : "[VERIFIED_SAFE]"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#71717a] uppercase">
            SAFETY_INDEX:
          </span>
          <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${styles.badgeBg}`}>
            {styles.safetyScore}/100
          </span>
        </div>
      </div>

      {/* Middle: Summary */}
      <div className="py-3.5 text-xs font-mono text-[#ffffff] leading-relaxed">
        {report.summary || "Execution trace verified across simulation and threat graph layers."}
      </div>

      {/* Bottom: Findings */}
      {report.findings && report.findings.length > 0 && (
        <div className="pt-2 pb-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-2">
            HEURISTIC FLAGS ({report.findings.length})
          </div>
          <FindingsList findings={report.findings} compact />
        </div>
      )}

      {/* Footer: Recommendation */}
      <div
        className={`mt-2 pt-3 border-t border-[#1c1c22] flex items-center justify-between font-mono text-xs ${styles.text}`}
      >
        <span className="text-[#a1a1aa] uppercase">POLICY VERDICT:</span>
        <span className="font-bold uppercase tracking-wider bg-[#16161b] px-3 py-1 rounded border border-[#27272a] text-[#ffffff]">
          {report.recommendation}
        </span>
      </div>
    </div>
  );
}
