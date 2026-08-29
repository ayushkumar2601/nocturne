export class PortfolioAnalyzer {
  static analyze(ethBalance: number, tokenBalances: any[]) {
    let riskScore = 0;
    let diversificationScore = 0;
    const insights: string[] = [];

    const assetCount = 1 + tokenBalances.length; // 1 for ETH

    if (assetCount === 1) {
      riskScore += 30;
      insights.push('High concentration risk: Only holding 1 asset (ETH).');
    } else if (assetCount > 5) {
      diversificationScore += 50;
      insights.push('Good diversification: Holding multiple assets.');
    }

    if (ethBalance < 0.05) {
      riskScore += 20;
      insights.push('Low native balance: May struggle to pay gas fees soon.');
    }

    if (ethBalance > 10) {
      riskScore += 10;
      insights.push('High native balance: Consider moving funds to cold storage.');
    }

    // Determine final levels
    const riskLevel = riskScore > 40 ? 'HIGH' : riskScore > 20 ? 'MEDIUM' : 'LOW';
    const diversificationLevel = diversificationScore > 40 ? 'HIGH' : diversificationScore > 20 ? 'MEDIUM' : 'LOW';

    return {
      assetCount,
      riskScore,
      riskLevel,
      diversificationScore,
      diversificationLevel,
      insights,
    };
  }
}
