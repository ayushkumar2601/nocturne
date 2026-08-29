import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../index.js";
import { AuditLogService } from "../services/AuditLogService.js";

describe("POST /analyze-contract", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuditLogService, "logAudit").mockResolvedValue();
  });

  it("verifies contract lookup and flags threat detection on known drainer", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/analyze-contract",
      payload: {
        prompt: "Analyze this contract",
        contractAddress: "0x00000000000000000000000000000000dead",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.type).toBe("contract_analysis");
    expect(body.riskScore).toBeGreaterThanOrEqual(95);
    expect(body.recommendation).toBe("Reject");
  });

  it("returns low risk for safe standard contract address", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/analyze-contract",
      payload: {
        contractAddress: "0x1234567890123456789012345678901234567890",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.riskScore).toBeLessThanOrEqual(50);
  });
});
