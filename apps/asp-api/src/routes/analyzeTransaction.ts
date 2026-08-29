import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { TransactionAnalyzer } from "@weth/agent";
import { AnalyzeTransactionRequestSchema } from "../schemas/transaction.js";
import { AuditLogService } from "../services/AuditLogService.js";

export default async function analyzeTransactionRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/analyze-transaction",
    {
      schema: {
        description: "Analyzes EVM transactions using simulation, policy evaluation, and threat graph intelligence.",
        tags: ["Guardian"],
        body: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            transaction: {
              type: "object",
              properties: {
                from: { type: "string" },
                to: { type: "string" },
                value: { type: "string" },
                data: { type: "string" }
              },
              required: ["from", "to"]
            }
          },
          required: ["transaction"]
        }
      },
    },
    async (request, reply) => {
      try {
        const parsed = AnalyzeTransactionRequestSchema.parse(request.body);
        const analyzer = new TransactionAnalyzer();
        const report = await analyzer.analyze(parsed.transaction);

        await AuditLogService.logAudit(
          "POST /analyze-transaction",
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
