import { describe, it, expect } from 'vitest';
import { PolicyEngine } from '../policy/PolicyEngine.js';
import { RiskEngine } from '../policy/RiskEngine.js';

describe('PolicyEngine', () => {
  it('blocks known bad addresses', () => {
    const result = PolicyEngine.evaluateTransaction({ to: '0x0000000000000000000000000000000000000000', value: '0' });
    expect(result.result).toBe('BLOCKED');
  });

  it('requires approval for large values', () => {
    const result = PolicyEngine.evaluateTransaction({ to: '0x123', value: '11000000000000000000' }); // 11 ETH
    expect(result.result).toBe('REQUIRES_APPROVAL');
  });

  it('marks safe transactions correctly', () => {
    const result = PolicyEngine.evaluateTransaction({ to: '0x123', value: '1000000000000000000' }); // 1 ETH
    expect(result.result).toBe('SAFE');
  });
});

describe('RiskEngine', () => {
  it('marks failed simulations as HIGH risk', () => {
    const result = RiskEngine.assessTransaction({ to: '0x123', value: '0', hasData: false, isUnknownContract: false, simulationFailed: true });
    expect(result.level).toBe('HIGH');
  });

  it('marks unknown contracts as HIGH risk', () => {
    const result = RiskEngine.assessTransaction({ to: '0x123', value: '0', hasData: true, isUnknownContract: true, simulationFailed: false });
    expect(result.level).toBe('HIGH');
  });

  it('marks normal transfers as LOW risk', () => {
    const result = RiskEngine.assessTransaction({ to: '0x123', value: '0', hasData: false, isUnknownContract: false, simulationFailed: false });
    expect(result.level).toBe('LOW');
  });
});
