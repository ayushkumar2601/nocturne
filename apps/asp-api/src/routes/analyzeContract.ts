import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ContractAnalyzer } from "@weth/agent";
import { AnalyzeContractRequestSchema } from "../schemas/contract.js";
import { AuditLogService } from "../services/AuditLogService.js";

export default async function analyzeContractRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/analyze-contract",
    {
      schema: {
        description: "Evaluates contract trust, bytecode reputation, and multi-hop threat graph connections.",
        tags: ["Guardian"],
        body: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            contractAddress: { type: "string" }
          },
          required: ["contractAddress"]
        }
      },
    },
    async (request, reply) => {
      try {
        const parsed = AnalyzeContractRequestSchema.parse(request.body);
        const analyzer = new ContractAnalyzer();
        const report = await analyzer.analyze(parsed.contractAddress);

        await AuditLogService.logAudit(
          "POST /analyze-contract",
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
