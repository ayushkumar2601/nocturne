import { FastifyInstance } from 'fastify';
import { EnsService } from '@weth/blockchain';
import { EnsSchema } from '@weth/shared';

export default async function (fastify: FastifyInstance) {
  fastify.get('/:name', async (request, reply) => {
    const { name } = request.params as { name: string };
    const parsed = EnsSchema.safeParse(name);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error });
    
    const result = await EnsService.resolveName(name);
    return result;
  });
}
