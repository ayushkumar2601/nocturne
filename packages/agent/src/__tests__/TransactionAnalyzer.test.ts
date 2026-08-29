import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransactionAnalyzer } from "../services/TransactionAnalyzer.js";
import { TransactionExecutionService } from "@weth/blockchain";

describe("TransactionAnalyzer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("detects unlimited approval and recommends Reject", async () => {
    vi.spyOn(TransactionExecutionService, "simulateTransaction").mockResolvedValue({
      success: true,
      data: "0x",
      warnings: [],
    });

    const approveMaxCalldata =
      "0x095ea7b3" +
      "0000000000000000000000009999999999999999999999999999999999999999" +
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    const report = await TransactionAnalyzer.analyze({
      from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      to: "0x9999999999999999999999999999999999999999",
      value: "0",
      data: approveMaxCalldata,
    });

    expect(report.type).toBe("transaction");
    expect(report.riskScore).toBeGreaterThanOrEqual(81);
    expect(report.recommendation).toBe("Reject");
    expect(report.findings.some((f) => f.title === "Unlimited Approval")).toBe(true);
  });

  it("recommends Reject when interacting with a known drainer contract", async () => {
    vi.spyOn(TransactionExecutionService, "simulateTransaction").mockResolvedValue({
      success: true,
      data: "0x",
      warnings: [],
    });

    const report = await TransactionAnalyzer.analyze({
      from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      to: "0x00000000000000000000000000000000dead", // Known drainer in ThreatGraph seed
      value: "1000000000000000000",
    });

    expect(report.riskScore).toBeGreaterThanOrEqual(95);
    expect(report.recommendation).toBe("Reject");
    expect(report.findings.some((f) => f.title.includes("Threat Detected"))).toBe(true);
  });

  it("marks low risk simple ETH transfer as Safe to Proceed", async () => {
    vi.spyOn(TransactionExecutionService, "simulateTransaction").mockResolvedValue({
      success: true,
      data: "0x",
      warnings: [],
    });

    const report = await TransactionAnalyzer.analyze({
      from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      to: "0x1234567890123456789012345678901234567890",
      value: "100000000000000000", // 0.1 ETH
    });

    expect(report.riskScore).toBeLessThanOrEqual(20);
    expect(report.recommendation).toBe("Safe to Proceed");
  });
});
