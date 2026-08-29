import { FastifyInstance } from 'fastify';
import { ChainRouter } from '@weth/blockchain';
import { EnsSchema, SupportedChain } from '@weth/shared';

export default async function (fastify: FastifyInstance) {
  fastify.get('/:name', async (request, reply) => {
    const { name } = request.params as { name: string };
    const { chain } = request.query as { chain?: SupportedChain };
    const parsed = EnsSchema.safeParse(name);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    // We only support ENS on Ethereum, but we use ChainRouter to be consistent
    const activeChain = chain || SupportedChain.ETHEREUM;
    const resolved = await ChainRouter.resolveEns(activeChain, name);
    return resolved;
  });
}
