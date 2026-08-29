import { FastifyInstance } from 'fastify';
import { BalanceService, TransactionService } from '@weth/blockchain';
import { AddressSchema, PortfolioAnalyzer, ApprovalAnalyzer } from '@weth/shared';

export default async function (fastify: FastifyInstance) {
  fastify.get('/:address', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    return { address };
  });

  fastify.get('/:address/balance', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    const balance = await BalanceService.getBalance(address);
    return balance;
  });

  fastify.get('/:address/tokens', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    const tokens = await BalanceService.getTokenBalances(address);
    return { tokens };
  });

  fastify.get('/:address/transactions', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    const txs = await TransactionService.getTransactions(address);
    return { transactions: txs };
  });

  fastify.get('/:address/summary', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const [balance, tokens, txs] = await Promise.all([
      BalanceService.getBalance(address),
      BalanceService.getTokenBalances(address),
      TransactionService.getTransactions(address)
    ]);

    return {
      ethBalance: balance.eth,
      tokenCount: tokens.length,
      recentActivity: txs.length
    };
  });

  fastify.get('/:address/analytics', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const [balance, tokens] = await Promise.all([
      BalanceService.getBalance(address),
      BalanceService.getTokenBalances(address)
    ]);
    return PortfolioAnalyzer.analyze(balance.eth, tokens);
  });

  fastify.get('/:address/approvals', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const txs = await TransactionService.getTransactions(address);
    return ApprovalAnalyzer.analyzeApprovals(txs);
  });
}
