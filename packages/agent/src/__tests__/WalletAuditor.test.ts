import { describe, it, expect, vi, beforeEach } from "vitest";
import { WalletAuditor } from "../services/WalletAuditor.js";
import { ChainRouter } from "@weth/blockchain";

vi.mock("@weth/blockchain", () => ({
  ChainRouter: {
    getBalance: vi.fn(),
    getTokenBalances: vi.fn(),
    getTransactions: vi.fn(),
  },
}));

describe("WalletAuditor", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("audits wallet and calculates penalties when risky approvals exist", async () => {
    vi.spyOn(ChainRouter, "getBalance").mockResolvedValue({ eth: 2.5, network: "sepolia" });
    vi.spyOn(ChainRouter, "getTokenBalances").mockResolvedValue([
      { contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", rawBalance: "1000000" },
    ]);
    vi.spyOn(ChainRouter, "getTransactions").mockResolvedValue([
      {
        category: "erc20",
        to: "0x00000000000000000000000000000000dead",
      },
    ]);

    const report = await WalletAuditor.audit("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");

    expect(report.type).toBe("wallet_audit");
    expect(report.riskScore).toBeGreaterThan(0);
    expect(report.findings.length).toBeGreaterThan(0);
    expect(report.formattedText).toContain("Wallet Score:");
  });

  it("returns 100/100 wallet score when no risky approvals or threats exist", async () => {
    vi.spyOn(ChainRouter, "getBalance").mockResolvedValue({ eth: 1.0, network: "sepolia" });
    vi.spyOn(ChainRouter, "getTokenBalances").mockResolvedValue([]);
    vi.spyOn(ChainRouter, "getTransactions").mockResolvedValue([
      {
        category: "external",
        to: "0x1234567890123456789012345678901234567890",
      },
    ]);

    const report = await WalletAuditor.audit("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");

    expect(report.type).toBe("wallet_audit");
    expect(report.riskScore).toBe(0);
    expect(report.formattedText).toContain("Wallet Score: 100/100");
  });
});
