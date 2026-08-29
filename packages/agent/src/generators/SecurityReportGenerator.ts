import {
  GuardianFinding,
  GuardianRecommendation,
  GuardianSecurityReport,
} from "../types/guardian.js";

export interface ReportGenerationInput {
  type: "transaction" | "wallet_audit" | "contract_analysis";
  riskScore: number;
  findings: GuardianFinding[];
  summary?: string;
  sanitizedCalldata?: string;
  sanitizedExplanation?: string;
  rawContext?: Record<string, unknown>;
}

/**
 * SecurityReportGenerator
 * Converts raw engine output and findings into standardized, human-readable GuardianSecurityReports.
 */
export class SecurityReportGenerator {
  /**
   * Maps 0-100 risk score to GuardianRecommendation based on strict policy thresholds.
   */
  static mapRiskToRecommendation(riskScore: number): GuardianRecommendation {
    if (riskScore <= 20) return "Safe to Proceed";
    if (riskScore <= 40) return "Approve";
    if (riskScore <= 60) return "Caution";
    return "Reject"; // 61-100 (Reject covers both 61-80 and 81-100 per spec)
  }

  /**
   * Generates a complete GuardianSecurityReport.
   */
  static generate(input: ReportGenerationInput): GuardianSecurityReport {
    const { type, riskScore, findings, rawContext, sanitizedCalldata, sanitizedExplanation } = input;
    const recommendation = this.mapRiskToRecommendation(riskScore);
    const timestamp = new Date().toISOString();

    let summary = input.summary || "";
    let formattedText = "";

    if (type === "transaction") {
      const hasUnlimitedApproval = findings.some(
        (f) =>
          f.title.toLowerCase().includes("unlimited approval") ||
          f.description.toLowerCase().includes("indefinitely")
      );

      if (!summary) {
        if (hasUnlimitedApproval) {
          summary =
            "This transaction requests unlimited token approval. The contract retains spending permissions.";
        } else if (riskScore > 60) {
          summary =
            "This transaction exhibits high risk heuristics or interacts with a flagged contract.";
        } else if (riskScore > 20) {
          summary =
            "This transaction has moderate risk due to unverified contract interaction or non-standard calldata.";
        } else {
          summary = "Standard low-risk transfer or safe contract interaction.";
        }
      }

      formattedText = `${summary}\n\nRisk Score: ${riskScore}/100\n\nRecommendation: ${recommendation}`;
    } else if (type === "wallet_audit") {
      const walletScore = Math.max(0, 100 - riskScore);
      const issuesSummary =
        findings.length > 0
          ? `${findings.length} ${findings.length === 1 ? "Issue" : "Issues"} (${findings.map((f) => f.title).join(", ")})`
          : "0 Issues Found";
      const exposure =
        rawContext && rawContext.exposure ? String(rawContext.exposure) : "$0";

      if (!summary) {
        summary = `Wallet Score: ${walletScore}/100. Detected ${findings.length} potential security risk(s) across recent approvals and transactions.`;
      }

      formattedText = `Wallet Score: ${walletScore}/100\nIssues: ${issuesSummary}\nExposure: ${exposure}\n\nRisk Score: ${riskScore}/100\nRecommendation: ${recommendation}`;
    } else if (type === "contract_analysis") {
      const isVerified = rawContext && rawContext.verified !== undefined ? Boolean(rawContext.verified) : true;
      const verificationText = isVerified ? "Verified" : "Unverified";
      const trustTier =
        rawContext && typeof rawContext.trustTier === "string"
          ? rawContext.trustTier
          : riskScore > 80
          ? "Critical Threat"
          : riskScore > 50
          ? "High Risk"
          : riskScore > 20
          ? "Medium Risk"
          : "Verified / High Trust";
      const threatWalletsCount =
        rawContext && typeof rawContext.relatedThreatWalletsCount === "number"
          ? rawContext.relatedThreatWalletsCount
          : 0;

      if (!summary) {
        summary = `Contract verification: ${verificationText}. Trust assessment: ${trustTier} with ${threatWalletsCount} related threat wallet interactions.`;
      }

      formattedText = `Verification: ${verificationText}\nTrust: ${trustTier}\nRelated Threat Wallets: ${threatWalletsCount}\n\nRisk Score: ${riskScore}/100\nRecommendation: ${recommendation}`;
    }

    return {
      summary,
      riskScore,
      recommendation,
      findings,
      type,
      timestamp,
      formattedText,
      sanitizedCalldata,
      sanitizedExplanation,
      rawContext,
    };
  }
}
