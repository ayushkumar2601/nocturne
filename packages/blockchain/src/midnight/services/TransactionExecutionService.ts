import { parseEther, formatEther } from 'viem';
import { logger } from '@weth/shared';
import { midnightPublicClient } from '../client.js';

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

  static async estimateGas(params: { from: string; to: string; value: string; data?: string }) {
    const { from, to, value, data } = params;
    
    // MOCK FOR MIDNIGHT HACKATHON DEMO
    if (from.startsWith('mn_') || to.startsWith('mn_')) {
      return {
        gasLimit: "21000",
        gasPrice: "15000000000",
        maxFeePerGas: "15000000000",
        maxPriorityFeePerGas: "1500000000",
        estimatedCostETH: "0.000315", // tMID
      };
    }

    const valueWei = TransactionExecutionService.parseValueToWei(value);

    let gasLimit = 21000n;
    let gasPrice = 15000000000n; 
    let maxFeePerGas = 15000000000n;
    let maxPriorityFeePerGas = 1500000000n;

    try {
      gasLimit = await midnightPublicClient.estimateGas({
        account: from as `0x${string}`,
        to: to as `0x${string}`,
        value: valueWei,
        data: data as `0x${string}` | undefined,
      });
    } catch (err: any) {
      logger.warn({ err: err.message, params }, 'Midnight RPC estimateGas failed, falling back to 21000 gas limit');
    }

    try {
      const feeData = await midnightPublicClient.estimateFeesPerGas();
      if (feeData.maxFeePerGas) maxFeePerGas = feeData.maxFeePerGas;
      if (feeData.maxPriorityFeePerGas) maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      gasPrice = await midnightPublicClient.getGasPrice();
    } catch (err: any) {
      logger.warn({ err: err.message }, 'Midnight RPC fee estimation failed, falling back to default gas price');
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

  static async simulateTransaction(params: { from: string; to: string; value: string; data?: string }) {
    const { from, to, value, data } = params;
    
    // MOCK FOR MIDNIGHT HACKATHON DEMO
    if (from.startsWith('mn_') || to.startsWith('mn_')) {
      return {
        success: true,
        data: data || '0x',
        warnings: [],
      };
    }

    const valueWei = TransactionExecutionService.parseValueToWei(value);
    try {
      const result = await midnightPublicClient.call({
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
      logger.warn({ err, params }, 'Midnight transaction simulation reverted');
      return {
        success: false,
        error: err.message,
        warnings: ['Transaction reverted during simulation on Midnight'],
      };
    }
  }

  static async broadcastTransaction(signedTransaction: string) {
    try {
      // Viem sendRawTransaction for midnight
      const txHash = await midnightPublicClient.sendRawTransaction({
        serializedTransaction: signedTransaction as `0x${string}`,
      });
      return { txHash };
    } catch (err: any) {
      logger.error({ err }, 'Failed to broadcast transaction on Midnight');
      throw new Error(`Broadcast failed: ${err.message}`);
    }
  }

  static async getTransactionReceipt(txHash: string) {
    try {
      const receipt = await midnightPublicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
      return receipt;
    } catch (err: any) {
      logger.error({ err, txHash }, 'Failed to get transaction receipt on Midnight');
      throw new Error(`Receipt fetch failed: ${err.message}`);
    }
  }
}
