import React from "react";
import { RiskGauge } from "./RiskGauge";
import { Shield, DollarSign, Terminal } from "lucide-react";
import { GuardianSecurityReport } from "@weth/agent";

interface WalletScoreCardProps {
  score?: number;
  status?: string;
  exposureAmount?: string;
  address?: string;
  report?: GuardianSecurityReport;
  onAuditClick?: () => void;
}

export function WalletScoreCard({
  score = 0,
  status = "[VERIFIED_SAFE]",
  exposureAmount = "$0",
  address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  report,
  onAuditClick,
}: WalletScoreCardProps) {
  const displayScore = report?.riskScore !== undefined ? report.riskScore : score;
  const displayStatus =
    report?.recommendation === "Reject" || displayScore >= 81
      ? "[CRITICAL_EXPOSURE]"
      : displayScore >= 61
      ? status || "[HIGH_RISK_DETECTED]"
      : displayScore >= 41 || report?.recommendation === "Caution"
      ? "[MODERATE_EXPOSURE]"
      : "[VERIFIED_SAFE]";

  const isHighRisk = displayScore >= 61 || report?.recommendation === "Reject";

  return (
    <div className="rounded-xl border border-[#1c1c22] bg-[#0a0a0c] p-6 shadow-sm flex flex-col justify-between gap-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#1c1c22] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">
            <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>WALLET HEALTH &amp; RISK INDEX</span>
          </div>
          <div className="font-mono text-xs text-[#ffffff] truncate max-w-[240px]">
            {address}
          </div>
        </div>
        {onAuditClick && (
          <button
            onClick={onAuditClick}
            className="text-[11px] font-mono uppercase font-bold px-3 py-1.5 rounded bg-[#ffffff] text-[#000000] hover:bg-[#e4e4e7] transition-all cursor-pointer shrink-0 shadow-sm"
          >
            RESCAN GRAPH
          </button>
        )}
      </div>

      <div className="flex items-center justify-around py-2 gap-6">
        <div className="flex flex-col items-center">
          <RiskGauge
            score={displayScore}
            recommendation={report?.recommendation}
            size="lg"
            showLabel={false}
          />
        </div>

        <div className="flex flex-col gap-4 border-l border-[#1c1c22] pl-6 min-w-[160px] font-mono">
          <div>
            <div className="text-[11px] text-[#71717a] uppercase font-semibold">
              POSTURE VERDICT
            </div>
            <div
              className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                isHighRisk
                  ? "text-red-400"
                  : displayScore >= 41
                  ? "text-amber-400"
                  : "text-[#10b981]"
              }`}
            >
              {displayStatus}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[11px] text-[#71717a] uppercase font-semibold">
              <DollarSign className="w-3 h-3 text-[#71717a]" />
              <span>ESTIMATED EXPOSURE</span>
            </div>
            <div className="text-xl font-bold text-[#ffffff] mt-0.5 tracking-tight">
              {exposureAmount}
            </div>
          </div>
        </div>
      </div>

      {report?.summary && (
        <div className="text-xs bg-[#101014] p-3.5 rounded border border-[#1c1c22] font-mono text-[#d4d4d8] leading-relaxed">
          <span className="font-bold text-[#ffffff]">HEURISTIC SUMMARY: </span>
          {report.summary}
        </div>
      )}
    </div>
  );
}
