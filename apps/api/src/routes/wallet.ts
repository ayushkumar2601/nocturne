import { FastifyInstance } from 'fastify';
import { ChainRouter } from '@weth/blockchain';
import { AddressSchema, PortfolioAnalyzer, ApprovalAnalyzer, SupportedChain } from '@weth/shared';

export default async function (fastify: FastifyInstance) {
  fastify.get('/:address', async (request, reply) => {
    const { address } = request.params as { address: string };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    return { address };
  });

  fastify.get('/:address/balance', async (request, reply) => {
    const { address } = request.params as { address: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    const balance = await ChainRouter.getBalance(chain || SupportedChain.ETHEREUM, address);
    return balance;
  });

  fastify.get('/:address/tokens', async (request, reply) => {
    const { address } = request.params as { address: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    const tokens = await ChainRouter.getTokenBalances(chain || SupportedChain.ETHEREUM, address);
    return { tokens };
  });

  fastify.get('/:address/transactions', async (request, reply) => {
    const { address } = request.params as { address: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    const txs = await ChainRouter.getTransactions(chain || SupportedChain.ETHEREUM, address);
    return { transactions: txs };
  });

  fastify.get('/:address/summary', async (request, reply) => {
    const { address } = request.params as { address: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const activeChain = chain || SupportedChain.ETHEREUM;
    const [balance, tokens, txs] = await Promise.all([
      ChainRouter.getBalance(activeChain, address),
      ChainRouter.getTokenBalances(activeChain, address),
      ChainRouter.getTransactions(activeChain, address)
    ]);

    return {
      ethBalance: balance.eth,
      tokenCount: tokens.length,
      recentActivity: txs.length
    };
  });

  fastify.get('/:address/analytics', async (request, reply) => {
    const { address } = request.params as { address: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const activeChain = chain || SupportedChain.ETHEREUM;
    const [balance, tokens] = await Promise.all([
      ChainRouter.getBalance(activeChain, address),
      ChainRouter.getTokenBalances(activeChain, address)
    ]);
    return PortfolioAnalyzer.analyze(balance.eth, tokens);
  });

  fastify.get('/:address/approvals', async (request, reply) => {
    const { address } = request.params as { address: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = AddressSchema.safeParse(address);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const activeChain = chain || SupportedChain.ETHEREUM;
    const txs = await ChainRouter.getTransactions(activeChain, address);
    return ApprovalAnalyzer.analyzeApprovals(txs);
  });
}
