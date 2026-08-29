import Fastify from 'fastify';
import { logger } from '@weth/shared';
import * as dotenv from 'dotenv';
import cors from '@fastify/cors';
import healthRoutes from './routes/health.js';
import walletRoutes from './routes/wallet.js';
import ensRoutes from './routes/ens.js';
import transactionRoutes from './routes/transactions.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename_api = fileURLToPath(import.meta.url);
const __dirname_api = path.dirname(__filename_api);
dotenv.config({ path: path.resolve(__dirname_api, '../../.env') });
dotenv.config({ path: path.resolve(__dirname_api, '../../../.env') });
dotenv.config();

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('postgres:postgres@')) {
  process.env.DATABASE_URL = "postgresql://weth:weth_pass@localhost:5433/weth_db?schema=public";
}

const fastify = Fastify({
  logger: logger
});

fastify.register(cors, { 
  origin: true 
});

fastify.register(healthRoutes);
fastify.register(walletRoutes, { prefix: '/wallet' });
fastify.register(ensRoutes, { prefix: '/ens' });
fastify.register(transactionRoutes, { prefix: '/transactions' });

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`API Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
