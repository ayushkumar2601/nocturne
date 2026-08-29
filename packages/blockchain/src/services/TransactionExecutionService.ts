import { viemClient } from '../client.js';
import { parseEther, parseGwei, formatEther } from 'viem';
import { logger } from '@weth/shared';

export class TransactionExecutionService {
  static parseValueToWei(valueStr: string): bigint {
    if (!valueStr || valueStr === '0') return 0n;
    const cleaned = valueStr.replace(/\s*ETH$/i, '').trim();
    if (cleaned.startsWith('0x')) {
      return BigInt(cleaned);
    }
    if (cleaned.includes('.')) {
      return parseEther(cleaned);
    }
    try {
      return BigInt(cleaned);
    } catch {
      try {
        return parseEther(cleaned);
      } catch {
        return 0n;
      }
    }
  }

  /**
   * Estimates gas for a transaction
   */
  static async estimateGas(params: { from: string; to: string; value: string; data?: string }) {
    const { from, to, value, data } = params;
    const valueWei = TransactionExecutionService.parseValueToWei(value);

    let gasLimit = 21000n;
    let gasPrice = 15000000000n; // 15 gwei
    let maxFeePerGas = 15000000000n;
    let maxPriorityFeePerGas = 1500000000n;

    try {
      gasLimit = await viemClient.estimateGas({
        account: from as `0x${string}`,
        to: to as `0x${string}`,
        value: valueWei,
        data: data as `0x${string}` | undefined,
      });
    } catch (err: any) {
      logger.warn({ err: err.message, params }, 'RPC estimateGas failed, falling back to 21000 gas limit');
    }

    try {
      const feeData = await viemClient.estimateFeesPerGas();
      if (feeData.maxFeePerGas) maxFeePerGas = feeData.maxFeePerGas;
      if (feeData.maxPriorityFeePerGas) maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      gasPrice = await viemClient.getGasPrice();
    } catch (err: any) {
      logger.warn({ err: err.message }, 'RPC fee estimation failed, falling back to default gas price');
    }

    const estimatedCostWei = gasLimit * (maxFeePerGas > 0n ? maxFeePerGas : gasPrice);

    return {
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      estimatedCostETH: formatEther(estimatedCostWei),
    };
  }

  /**
   * Simulates a transaction
   */
  static async simulateTransaction(params: { from: string; to: string; value: string; data?: string }) {
    const { from, to, value, data } = params;
    const valueWei = TransactionExecutionService.parseValueToWei(value);
    try {
      const result = await viemClient.call({
        account: from as `0x${string}`,
        to: to as `0x${string}`,
        value: valueWei,
        data: data as `0x${string}` | undefined,
      });

      return {
        success: true,
        data: result.data || '0x',
        warnings: [],
      };
    } catch (err: any) {
      logger.warn({ err, params }, 'Transaction simulation reverted');
      return {
        success: false,
        error: err.message,
        warnings: ['Transaction reverted during simulation'],
      };
    }
  }

  /**
   * Broadcasts a signed transaction
   */
  static async broadcastTransaction(signedTransaction: string) {
    try {
      const txHash = await viemClient.sendRawTransaction({
        serializedTransaction: signedTransaction as `0x${string}`,
      });
      return { txHash };
    } catch (err: any) {
      logger.error({ err }, 'Failed to broadcast transaction');
      throw new Error(`Broadcast failed: ${err.message}`);
    }
  }

  /**
   * Gets a transaction receipt
   */
  static async getTransactionReceipt(txHash: string) {
    try {
      const receipt = await viemClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
      return receipt;
    } catch (err: any) {
      logger.error({ err, txHash }, 'Failed to get transaction receipt');
      throw new Error(`Receipt fetch failed: ${err.message}`);
    }
  }
}
