import { describe, it, expect } from "vitest";
import { IntentRouter, GuardianIntent } from "../intents/IntentRouter.js";

describe("IntentRouter", () => {
  it("classifies transaction intent and extracts address and calldata", () => {
    const input = "Analyze this transaction to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e with calldata 0x095ea7b30000000000000000000000009999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const result = IntentRouter.route(input);

    expect(result.intent).toBe(GuardianIntent.ANALYZE_TRANSACTION);
    expect(result.extractedAddresses).toContain("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
    expect(result.calldata).toContain("0x095ea7b3");
  });

  it("classifies wallet audit intent and extracts wallet address", () => {
    const input = "Audit my wallet 0x1111111111111111111111111111111111111111";
    const result = IntentRouter.route(input);

    expect(result.intent).toBe(GuardianIntent.AUDIT_WALLET);
    expect(result.extractedAddresses).toContain("0x1111111111111111111111111111111111111111");
  });

  it("classifies contract analysis intent and extracts contract address", () => {
    const input = "Check contract trust for 0x00000000000000000000000000000000dead";
    const result = IntentRouter.route(input);

    expect(result.intent).toBe(GuardianIntent.ANALYZE_CONTRACT);
    expect(result.extractedAddresses).toContain("0x00000000000000000000000000000000dead");
  });

  it("returns UNKNOWN for unrecognized input without clear intent keywords", () => {
    const input = "hello good morning";
    const result = IntentRouter.route(input);

    expect(result.intent).toBe(GuardianIntent.UNKNOWN);
  });
});
