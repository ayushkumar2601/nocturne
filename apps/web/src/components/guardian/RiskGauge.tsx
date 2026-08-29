import React from "react";
import { GuardianRecommendation } from "@weth/agent";

interface RiskGaugeProps {
  score: number;
  recommendation?: GuardianRecommendation;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RiskGauge({
  score,
  recommendation,
  size = "md",
  showLabel = true,
}: RiskGaugeProps) {
  // Convert risk score (0-100) to Safety / Health Score out of 100
  const safetyScore = Math.max(0, Math.min(100, 100 - score));

  const isReject = recommendation === "Reject" || score >= 81 || safetyScore <= 19;
  const isCaution = recommendation === "Caution" || (score >= 41 && score <= 80) || (safetyScore >= 20 && safetyScore <= 59);

  const radius = size === "lg" ? 64 : size === "md" ? 44 : 32;
  const strokeWidth = size === "lg" ? 10 : size === "md" ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  // Fill gauge based on safetyScore: 100 = full ring, 0 = empty ring
  const strokeDashoffset = circumference - (safetyScore / 100) * circumference;

  const colorClass = isReject
    ? "stroke-red-500 text-red-400"
    : isCaution
    ? "stroke-amber-400 text-amber-400"
    : "stroke-[#10b981] text-[#10b981]";

  const labelText = isReject
    ? "[CRITICAL // REJECT]"
    : isCaution
    ? "[MODERATE // CAUTION]"
    : "[VERIFIED_SAFE]";

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
        >
          <circle
            className="stroke-[#1c1c22]"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
          <circle
            className={`transition-all duration-700 ease-out ${colorClass.split(" ")[0]}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className={`font-mono font-bold tracking-tighter ${
              size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm"
            } ${colorClass.split(" ")[1]}`}
          >
            {safetyScore}
          </span>
          <span className="text-[10px] font-mono text-[#71717a] uppercase">/ 100</span>
        </div>
      </div>
      {showLabel && (
        <div className={`text-[11px] font-mono font-bold uppercase tracking-wider ${colorClass.split(" ")[1]}`}>
          {recommendation || labelText}
        </div>
      )}
    </div>
  );
}
