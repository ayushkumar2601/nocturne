import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../index.js";
import { ChainRouter } from "@weth/blockchain";
import { AuditLogService } from "../services/AuditLogService.js";

describe("POST /analyze-transaction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuditLogService, "logAudit").mockResolvedValue();
  });

  it("verifies valid standard transaction and returns GuardianSecurityReport", async () => {
    vi.spyOn(ChainRouter, "simulateTransaction").mockResolvedValue({
      success: true,
      data: "0x",
      warnings: [],
    });

    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/analyze-transaction",
      payload: {
        prompt: "Analyze this transaction",
        transaction: {
          from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          to: "0x1234567890123456789012345678901234567890",
          value: "100000000000000000",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.type).toBe("transaction");
    expect(body.riskScore).toBeLessThanOrEqual(20);
    expect(body.recommendation).toBe("Safe to Proceed");
  });

  it("verifies unlimited approval detection and returns Reject", async () => {
    vi.spyOn(ChainRouter, "simulateTransaction").mockResolvedValue({
      success: true,
      data: "0x",
      warnings: [],
    });

    const approveMaxCalldata =
      "0x095ea7b3" +
      "0000000000000000000000009999999999999999999999999999999999999999" +
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/analyze-transaction",
      payload: {
        transaction: {
          from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          to: "0x9999999999999999999999999999999999999999",
          value: "0",
          data: approveMaxCalldata,
        },
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.riskScore).toBeGreaterThanOrEqual(81);
    expect(body.recommendation).toBe("Reject");
    expect(body.findings.some((f: any) => f.title === "Unlimited Approval")).toBe(true);
  });

  it("rejects invalid transaction request with malformed address", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/analyze-transaction",
      payload: {
        transaction: {
          from: "not-an-address",
          to: "0x1234567890123456789012345678901234567890",
        },
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe("Validation Error");
  });
});
