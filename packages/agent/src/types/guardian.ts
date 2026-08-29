/**
 * WETH Guardian Core Intelligence Types
 * Standardized intelligence contracts shared across analyzers, report generators, ASP API, and UI.
 */

export type GuardianRecommendation =
  | "Reject"
  | "Approve"
  | "Caution"
  | "Revoke Immediately"
  | "Safe to Proceed";

export type GuardianSeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "INFO";

export interface GuardianFinding {
  severity: GuardianSeverity;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface GuardianSecurityReport {
  summary: string;
  riskScore: number;
  recommendation: GuardianRecommendation;
  findings: GuardianFinding[];
  type:
    | "transaction"
    | "wallet_audit"
    | "contract_analysis";
  timestamp: string;
  formattedText: string;
  sanitizedCalldata?: string;
  sanitizedExplanation?: string;
  rawContext?: Record<string, unknown>;
}
