export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAssessment {
  level: RiskLevel;
  reasons: string[];
}

export class RiskEngine {
  static assessTransaction(params: {
    to: string;
    value: string; // in wei
    hasData: boolean;
    isUnknownContract: boolean;
    simulationFailed: boolean;
  }): RiskAssessment {
    const { value, hasData, isUnknownContract, simulationFailed } = params;
    const reasons: string[] = [];
    let level: RiskLevel = 'LOW';

    if (simulationFailed) {
      return {
        level: 'HIGH',
        reasons: ['Transaction simulation failed or reverted.']
      };
    }

    const valueEth = Number(value) / 1e18;

    if (isUnknownContract) {
      level = 'HIGH';
      reasons.push('Interacting with an unverified or unknown smart contract.');
    } else if (hasData) {
      level = 'MEDIUM';
      reasons.push('Transaction contains call data (contract interaction).');
    }

    if (valueEth > 5) {
      level = level === 'HIGH' ? 'HIGH' : 'MEDIUM';
      reasons.push('Transaction value is unusually high (> 5 ETH).');
    }

    if (reasons.length === 0) {
      reasons.push('Standard simple transfer to a known address.');
    }

    return { level, reasons };
  }
}
