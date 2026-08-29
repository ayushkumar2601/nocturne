import { ThreatGraphService } from "./ThreatGraphService.js";
import { SecurityReportGenerator } from "../generators/SecurityReportGenerator.js";
import { GuardianFinding, GuardianSecurityReport } from "../types/guardian.js";

/**
 * ContractAnalyzer
 * Evaluates contract verification, threat graph reputation, and related threat wallet
 * interactions to assign trust tiers and generate contract security reports.
 */
export class ContractAnalyzer {
  /**
   * Instance method wrapper for static analyze
   */
  async analyze(contractAddress: string): Promise<GuardianSecurityReport> {
    return ContractAnalyzer.analyze(contractAddress);
  }

  /**
   * Evaluates a contract address and returns a GuardianSecurityReport.
   */
  static async analyze(contractAddress: string): Promise<GuardianSecurityReport> {
    const cleanAddr = contractAddress.toLowerCase();

    // 1. Threat Graph Lookup & Related Threat Wallets
    const [exposure, relatedThreatWallets] = await Promise.all([
      ThreatGraphService.checkAddressExposure(cleanAddr),
      ThreatGraphService.getRelatedThreatWallets(cleanAddr),
    ]);

    // 2. Verification Check (Heuristic / bytecode reputation)
    // Contracts flagged with high risk or drainer status default to Unverified / Malicious
    const isVerified =
      exposure.riskScore < 50 &&
      cleanAddr !== "0x00000000000000000000000000000000dead" &&
      cleanAddr !== "0x0000000000000000000000000000000000000000";

    // 3. Trust Tier Assignment
    let trustTier = "Verified / High Trust";
    let riskScore = exposure.riskScore;

    if (exposure.riskScore >= 80 || cleanAddr === "0x00000000000000000000000000000000dead") {
      trustTier = "Critical Threat";
      riskScore = Math.max(riskScore, 95);
    } else if (exposure.riskScore >= 50 || relatedThreatWallets.count >= 5) {
      trustTier = "High Risk";
      riskScore = Math.max(riskScore, 65);
    } else if (exposure.riskScore >= 20 || !isVerified || relatedThreatWallets.count > 0) {
      trustTier = "Medium Risk";
      riskScore = Math.max(riskScore, 35);
    } else {
      trustTier = "Verified / High Trust";
      riskScore = Math.min(riskScore, 15);
    }

    // 4. Findings Generation
    const findings: GuardianFinding[] = [];

    if (trustTier === "Critical Threat") {
      findings.push({
        severity: "CRITICAL",
        title: "Critical Threat Contract Flagged",
        description:
          exposure.threats[0]?.label
            ? `Contract is known as: ${exposure.threats[0].label}.`
            : "Contract has severe threat graph connections or high risk heuristics.",
        metadata: { riskScore },
      });
    } else if (trustTier === "High Risk") {
      findings.push({
        severity: "HIGH",
        title: "High Risk Contract Reputation",
        description: "Contract exhibits elevated risk scores or multiple suspicious connections.",
        metadata: { riskScore },
      });
    }

    if (relatedThreatWallets.count > 0) {
      findings.push({
        severity: relatedThreatWallets.count >= 10 ? "HIGH" : "MEDIUM",
        title: "Connected Threat Wallets Detected",
        description: `This contract has documented interactions with ${relatedThreatWallets.count} flagged threat or compromised victim wallet(s).`,
        metadata: { count: relatedThreatWallets.count, sampleWallets: relatedThreatWallets.wallets.slice(0, 5) },
      });
    }

    if (!isVerified) {
      findings.push({
        severity: "MEDIUM",
        title: "Unverified Smart Contract",
        description: "The contract source code and bytecode verification check did not return verified status.",
      });
    } else if (findings.length === 0) {
      findings.push({
        severity: "INFO",
        title: "Verified Contract",
        description: "Contract passes standard bytecode verification and graph reputation checks.",
      });
    }

    // 5. Produce Security Report
    return SecurityReportGenerator.generate({
      type: "contract_analysis",
      riskScore,
      findings,
      rawContext: {
        contractAddress: cleanAddr,
        verified: isVerified,
        trustTier,
        relatedThreatWalletsCount: relatedThreatWallets.count,
        exposure,
        relatedThreatWallets,
      },
    });
  }
}
