import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../index.js";
import { ChainRouter } from "@weth/blockchain";
import { AuditLogService } from "../services/AuditLogService.js";

describe("POST /guardian/chat", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuditLogService, "logAudit").mockResolvedValue();
  });

  it("routes transaction intent to TransactionAnalyzer and generates conversational response", async () => {
    vi.spyOn(ChainRouter, "simulateTransaction").mockResolvedValue({
      success: true,
      data: "0x",
      warnings: [],
    });

    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/guardian/chat",
      payload: {
        message: "Analyze this transaction with calldata 0x095ea7b30000000000000000000000009999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.intent).toBe("ANALYZE_TRANSACTION");
    expect(body.assistantMessage).toContain("POLICY_RECOMMENDATION: Reject");
    expect(body.report.type).toBe("transaction");
  });

  it("routes wallet audit intent to WalletAuditor", async () => {
    vi.spyOn(ChainRouter, "getBalance").mockResolvedValue({ eth: 1.0, network: "sepolia" });
    vi.spyOn(ChainRouter, "getTokenBalances").mockResolvedValue([]);
    vi.spyOn(ChainRouter, "getTransactions").mockResolvedValue([]);

    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/guardian/chat",
      payload: {
        message: "Audit my wallet 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.intent).toBe("AUDIT_WALLET");
    expect(body.report.type).toBe("wallet_audit");
  });

  it("routes contract analysis intent to ContractAnalyzer", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/guardian/chat",
      payload: {
        message: "Check contract trust for 0x00000000000000000000000000000000dead",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.intent).toBe("ANALYZE_CONTRACT");
    expect(body.report.type).toBe("contract_analysis");
  });
});
