export class ApprovalAnalyzer {
  static analyzeApprovals(transactions: any[]) {
    const suspiciousContracts = new Set([
      '0x000000000000000000000000000000000000dead',
    ]);
    const riskyApprovals: any[] = [];
    const recommendations: string[] = [];

    for (const tx of transactions) {
      // In a real Indexer, we'd look for approval events.
      // We will mock the detection logic based on asset transfers to unknown contracts.
      if (tx.category === 'erc20' && suspiciousContracts.has(tx.to)) {
        riskyApprovals.push({
          contract: tx.to,
          reason: 'Interacted with known suspicious contract.',
        });
      }
    }

    if (riskyApprovals.length > 0) {
      recommendations.push('Revoke allowances to suspicious contracts immediately.');
    } else {
      recommendations.push('No suspicious ERC20 approvals detected in recent history.');
    }

    return {
      riskyApprovals,
      recommendations,
    };
  }
}
