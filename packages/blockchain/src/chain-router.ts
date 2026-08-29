import { SupportedChain } from '@weth/shared';

// Ethereum Services
import { BalanceService as EthBalanceService } from './ethereum/services/BalanceService.js';
import { TransactionExecutionService as EthTxService } from './ethereum/services/TransactionExecutionService.js';
import { EnsService as EthEnsService } from './ethereum/services/EnsService.js';
import { TransactionService as EthTransactionService } from './ethereum/services/TransactionService.js';

// Midnight Services
import { BalanceService as MidnightBalanceService } from './midnight/services/BalanceService.js';
import { TransactionExecutionService as MidnightTxService } from './midnight/services/TransactionExecutionService.js';

export class ChainRouter {
  static async getBalance(chain: SupportedChain, address: string): Promise<{ eth: number; network: string }> {
    if (chain === SupportedChain.MIDNIGHT) {
      return MidnightBalanceService.getBalance(address);
    }
    return EthBalanceService.getBalance(address);
  }

  static async getTokenBalances(chain: SupportedChain, address: string): Promise<any[]> {
    if (chain === SupportedChain.MIDNIGHT) {
      return MidnightBalanceService.getTokenBalances(address);
    }
    return EthBalanceService.getTokenBalances(address);
  }

  static async getTransactions(chain: SupportedChain, address: string): Promise<any[]> {
    if (chain === SupportedChain.MIDNIGHT) {
      return []; // Mock empty transactions for Midnight
    }
    return EthTransactionService.getTransactions(address);
  }

  static async estimateGas(chain: SupportedChain, params: { from: string; to: string; value: string; data?: string }) {
    if (chain === SupportedChain.MIDNIGHT) {
      return MidnightTxService.estimateGas(params);
    }
    return EthTxService.estimateGas(params);
  }

  static async simulateTransaction(chain: SupportedChain, params: { from: string; to: string; value: string; data?: string }) {
    if (chain === SupportedChain.MIDNIGHT) {
      return MidnightTxService.simulateTransaction(params);
    }
    return EthTxService.simulateTransaction(params);
  }

  static async broadcastTransaction(chain: SupportedChain, signedTransaction: string) {
    if (chain === SupportedChain.MIDNIGHT) {
      return MidnightTxService.broadcastTransaction(signedTransaction);
    }
    return EthTxService.broadcastTransaction(signedTransaction);
  }

  static async getTransactionReceipt(chain: SupportedChain, txHash: string) {
    if (chain === SupportedChain.MIDNIGHT) {
      return MidnightTxService.getTransactionReceipt(txHash);
    }
    return EthTxService.getTransactionReceipt(txHash);
  }

  static async resolveEns(chain: SupportedChain, name: string) {
    // ENS is Ethereum only, fallback if called for Midnight
    if (chain === SupportedChain.MIDNIGHT) {
      return null;
    }
    return EthEnsService.resolveName(name);
  }
}
