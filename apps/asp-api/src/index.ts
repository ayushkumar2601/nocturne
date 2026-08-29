import Fastify, { FastifyInstance } from "fastify";
import { logger } from "@weth/shared";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import corsPlugin from "./plugins/cors.js";
import swaggerPlugin from "./plugins/swagger.js";

import healthRoutes from "./routes/health.js";
import analyzeTransactionRoutes from "./routes/analyzeTransaction.js";
import auditWalletRoutes from "./routes/auditWallet.js";
import analyzeContractRoutes from "./routes/analyzeContract.js";
import guardianChatRoutes from "./routes/guardianChat.js";

const __filename_api = fileURLToPath(import.meta.url);
const __dirname_api = path.dirname(__filename_api);
dotenv.config({ path: path.resolve(__dirname_api, "../../.env") });
dotenv.config({ path: path.resolve(__dirname_api, "../../../.env") });
dotenv.config();

/**
 * buildApp
 * Configures and returns the WETH Guardian ASP Fastify server instance without starting listening.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: logger as any,
  }) as unknown as FastifyInstance;

  await fastify.register(corsPlugin);
  await fastify.register(swaggerPlugin);

  await fastify.register(healthRoutes);
  await fastify.register(analyzeTransactionRoutes);
  await fastify.register(auditWalletRoutes);
  await fastify.register(analyzeContractRoutes);
  await fastify.register(guardianChatRoutes);

  return fastify;
}

const start = async () => {
  // Only auto-start when running as main script
  if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    try {
      const app = await buildApp();
      const portStr = process.env.ASP_PORT || process.env.PORT || "3003";
      const port = parseInt(portStr, 10);
      await app.listen({ port, host: "0.0.0.0" });
      app.log.info(`WETH Guardian ASP running on port ${port}`);
    } catch (err) {
      logger.error(err, "Failed to start WETH Guardian ASP API server.");
      process.exit(1);
    }
  }
};

start();
