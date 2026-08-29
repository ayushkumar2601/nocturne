import { FastifyInstance } from 'fastify';
import { prisma } from '@weth/database';
import { redis } from '@weth/blockchain';

export default async function (fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    try {
      // Check DB and Redis health
      await prisma.$queryRaw`SELECT 1`;
      await redis.ping();
      return { status: 'ok' };
    } catch (e: any) {
      fastify.log.error(`Health check failed: ${e.message}`);
      return reply.status(503).send({ status: 'error', message: 'Service Unavailable' });
    }
  });
}
