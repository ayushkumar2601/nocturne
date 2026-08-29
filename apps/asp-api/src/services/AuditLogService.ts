import { prisma } from "../plugins/prisma.js";
import { logger } from "@weth/shared";

/**
 * AuditLogService
 * Persists ASP request/response audit records into the database using existing TransactionAudit model.
 */
export class AuditLogService {
  static async logAudit(
    endpoint: string,
    requestPayload: unknown,
    responsePayload: unknown,
    riskScore?: number,
    recommendation?: string
  ): Promise<void> {
    try {
      await prisma.transactionAudit.create({
        data: {
          toolName: endpoint,
          requestPayload: requestPayload as any,
          responsePayload: {
            response: responsePayload as any,
            riskScore,
            recommendation,
          } as any,
        },
      });
      logger.debug({ endpoint, riskScore, recommendation }, "ASP Audit Log recorded successfully.");
    } catch (err: any) {
      logger.warn({ err: err.message, endpoint }, "Failed to record ASP Audit Log into database.");
    }
  }
}
