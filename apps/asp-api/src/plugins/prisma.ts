import { PrismaClient } from "@weth/database";
import { logger } from "@weth/shared";

/**
 * Singleton PrismaClient instance exported for audit logging across services.
 */
export const prisma = new PrismaClient({
  log: ["error", "warn"],
});

prisma.$connect().catch((err: any) => {
  logger.warn({ err: err.message }, "ASP API: Failed to connect to Prisma database initially.");
});
