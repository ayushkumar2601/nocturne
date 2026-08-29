import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../index.js";
import { BalanceService, TransactionService } from "@weth/blockchain";
import { AuditLogService } from "../services/AuditLogService.js";

describe("POST /audit-wallet", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuditLogService, "logAudit").mockResolvedValue();
  });

  it("verifies valid wallet and returns GuardianSecurityReport", async () => {
    vi.spyOn(BalanceService, "getBalance").mockResolvedValue({ eth: 1.5, network: "sepolia" });
    vi.spyOn(BalanceService, "getTokenBalances").mockResolvedValue([]);
    vi.spyOn(TransactionService, "getTransactions").mockResolvedValue([]);

    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/audit-wallet",
      payload: {
        prompt: "Audit my wallet",
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.type).toBe("wallet_audit");
    expect(body.riskScore).toBe(0);
  });

  it("rejects request when address is missing or invalid", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/audit-wallet",
      payload: {
        prompt: "Audit my wallet",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe("Validation Error");
  });
});
