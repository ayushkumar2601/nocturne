import { describe, it, expect } from "vitest";
import { ContractAnalyzer } from "../services/ContractAnalyzer.js";

describe("ContractAnalyzer", () => {
  it("flags known drainer as Critical Threat", async () => {
    const report = await ContractAnalyzer.analyze("0x00000000000000000000000000000000dead");

    expect(report.type).toBe("contract_analysis");
    expect(report.riskScore).toBeGreaterThanOrEqual(95);
    expect(report.recommendation).toBe("Reject");
    expect(report.formattedText).toContain("Trust: Critical Threat");
    expect(report.findings.some((f) => f.title.includes("Critical Threat"))).toBe(true);
  });

  it("evaluates standard address and assigns appropriate trust tier", async () => {
    const report = await ContractAnalyzer.analyze("0x1234567890123456789012345678901234567890");

    expect(report.type).toBe("contract_analysis");
    expect(report.riskScore).toBeLessThanOrEqual(50);
  });
});
