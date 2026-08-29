/**
 * IntentRouter
 * Classifies user intent and extracts addresses / calldata without relying on an LLM.
 */

export enum GuardianIntent {
  ANALYZE_TRANSACTION = 0,
  AUDIT_WALLET = 1,
  ANALYZE_CONTRACT = 2,
  UNKNOWN = 3,
}

export interface IntentRouteResult {
  intent: GuardianIntent;
  extractedAddresses: string[];
  calldata?: string;
}

export class IntentRouter {
  /**
   * Routes and classifies input text into a GuardianIntent and extracts hex items.
   */
  static route(input: string): IntentRouteResult {
    if (!input || typeof input !== "string") {
      return {
        intent: GuardianIntent.UNKNOWN,
        extractedAddresses: [],
      };
    }

    const trimmed = input.trim();
    const extractedAddresses: string[] = [];
    let calldata: string | undefined = undefined;

    // Extract all hex strings starting with 0x
    const hexMatches = trimmed.match(/0x[a-fA-F0-9]+/g) || [];
    for (const match of hexMatches) {
      if (match.length >= 36 && match.length <= 42) {
        // Standard 20-byte Ethereum address (or slightly truncated known burn/drainer addresses like 0x...dead)
        if (!extractedAddresses.includes(match)) {
          extractedAddresses.push(match);
        }
      } else if (match.length > 42 || (match.length >= 10 && match.length < 36 && /calldata|approve|0x095ea7b3/i.test(trimmed))) {
        // Calldata string (>42 characters or standalone function selector if context suggests calldata)
        calldata = match;
      }
    }

    const lower = trimmed.toLowerCase();

    // 1. Transaction Intent Keywords & Heuristics
    const txPatterns = [
      /\btransaction\b/,
      /\btx\b/,
      /\bsimulate\b/,
      /\bcalldata\b/,
      /0x095ea7b3/, // approve selector
    ];
    const isTx = txPatterns.some((regex) => regex.test(lower)) || (!!calldata && !/\bcontract\b|\bwallet\b/i.test(lower));
    if (isTx) {
      return {
        intent: GuardianIntent.ANALYZE_TRANSACTION,
        extractedAddresses,
        calldata,
      };
    }

    // 2. Contract Analysis Keywords & Heuristics
    const contractPatterns = [
      /\bcontract\b/,
      /\bverify\b/,
      /\btrust\b/,
    ];
    const isContract = contractPatterns.some((regex) => regex.test(lower));
    if (isContract) {
      return {
        intent: GuardianIntent.ANALYZE_CONTRACT,
        extractedAddresses,
        calldata,
      };
    }

    // 3. Wallet Audit Keywords & Heuristics
    const walletPatterns = [
      /\bwallet\b/,
      /\baudit\b/,
      /\bscore\b/,
    ];
    const isWallet = walletPatterns.some((regex) => regex.test(lower));
    if (isWallet) {
      return {
        intent: GuardianIntent.AUDIT_WALLET,
        extractedAddresses,
        calldata,
      };
    }

    // Fallback: if only address provided with no keywords, default to AUDIT_WALLET or UNKNOWN based on context
    // Per strict requirements, classify based on patterns or UNKNOWN if unclear.
    return {
      intent: GuardianIntent.UNKNOWN,
      extractedAddresses,
      calldata,
    };
  }
}
