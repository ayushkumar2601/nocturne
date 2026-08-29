import { GuardianSecurityReport } from "@weth/agent";

/**
 * GuardianChatService
 * Transforms structured GuardianSecurityReports into human-readable, conversational AI responses.
 */
export class GuardianChatService {
  static generateResponse(report: GuardianSecurityReport): string {
    const { riskScore, recommendation, summary, findings, sanitizedCalldata, sanitizedExplanation } = report;

    let prefix = "[VERIFIED_SAFE // NO_RISKS_DETECTED]";
    if (recommendation === "Reject" || riskScore >= 61) {
      prefix = "[CRITICAL_RISK // REJECT_TRANSACTION]";
    } else if (recommendation === "Caution" || riskScore >= 41) {
      prefix = "[MODERATE_RISK // PROCEED_WITH_CAUTION]";
    } else if (recommendation === "Approve" || riskScore > 20) {
      prefix = "[LOW_RISK // APPROVED]";
    }

    const details = findings
      .map((f: any) => f.description)
      .filter((d: any) => d && !summary.includes(d))
      .join(" ");

    const middleText = details ? `${summary}\n\n${details}` : summary;

    let response = `${prefix}\n\n${middleText}\n\nRISK_INDEX: ${riskScore}/100\nPOLICY_RECOMMENDATION: ${recommendation}`;

    if (sanitizedCalldata) {
      response += `\n\n[AUTO-REMEDIATION // SANITIZED PAYLOAD GENERATED]\nEXPLANATION: ${sanitizedExplanation || "Dangerous permissions stripped."}\nSANITIZED_CALLDATA: ${sanitizedCalldata}`;
    }

    return response;
  }
}
