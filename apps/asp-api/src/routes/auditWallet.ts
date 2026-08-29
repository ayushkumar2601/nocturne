import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { WalletAuditor } from "@weth/agent";
import { AuditWalletRequestSchema } from "../schemas/wallet.js";
import { AuditLogService } from "../services/AuditLogService.js";

export default async function auditWalletRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/audit-wallet",
    {
      schema: {
        description: "Audits a wallet address across balances, token allowances, and threat reputation.",
        tags: ["Guardian"],
        body: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            address: { type: "string" },
            walletAddress: { type: "string" }
          }
        }
      },
    },
    async (request, reply) => {
      try {
        const parsed = AuditWalletRequestSchema.parse(request.body);
        const auditor = new WalletAuditor();
        const targetAddress = parsed.address || parsed.walletAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
        const report = await auditor.audit(targetAddress);

        await AuditLogService.logAudit(
          "POST /audit-wallet",
          parsed,
          report,
          report.riskScore,
          report.recommendation
        );

        return reply.status(200).send(report);
      } catch (err: any) {
        if (err instanceof ZodError) {
          return reply.status(400).send({
            error: "Validation Error",
            issues: err.errors,
          });
        }
        fastify.log.error(err);
        return reply.status(500).send({
          error: "Internal Server Error",
          message: err.message,
        });
      }
    }
  );
}
