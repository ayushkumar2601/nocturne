import { formatEther } from 'viem';

export type PolicyResult = 'SAFE' | 'REQUIRES_APPROVAL' | 'BLOCKED';

export interface PolicyDecisionResult {
  result: PolicyResult;
  reason: string;
}

const MAX_TRANSACTION_VALUE_ETH = 10;
const BLOCKED_ADDRESSES = new Set([
  '0x0000000000000000000000000000000000000000',
  '0x000000000000000000000000000000000000dead'
]);

export class PolicyEngine {
  static evaluateTransaction(params: {
    to: string;
    value: string; // value in wei
    isNewAddress?: boolean;
    isUnknownContract?: boolean;
  }): PolicyDecisionResult {
    const { to, value, isNewAddress, isUnknownContract } = params;
    const toAddress = to.toLowerCase();

    // Check Blocklist
    if (BLOCKED_ADDRESSES.has(toAddress)) {
      return { result: 'BLOCKED', reason: `Address ${to} is blocked by policy.` };
    }

    // Check Max Value
    const valueEth = parseFloat(formatEther(BigInt(value || '0')));
    if (valueEth > MAX_TRANSACTION_VALUE_ETH) {
      return { result: 'REQUIRES_APPROVAL', reason: `Value exceeds ${MAX_TRANSACTION_VALUE_ETH} ETH limit.` };
    }

    // Check contract/address heuristics
    if (isUnknownContract) {
      return { result: 'REQUIRES_APPROVAL', reason: 'Interaction with an unknown contract requires manual approval.' };
    }

    if (isNewAddress) {
      return { result: 'REQUIRES_APPROVAL', reason: 'Transfer to a newly seen address requires manual approval.' };
    }

    return { result: 'SAFE', reason: 'Transaction passes all automated policies.' };
  }
}
