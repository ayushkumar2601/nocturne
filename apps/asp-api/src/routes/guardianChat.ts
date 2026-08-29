import { FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import {
  IntentRouter,
  GuardianIntent,
  TransactionAnalyzer,
  WalletAuditor,
  ContractAnalyzer,
  GuardianSecurityReport,
} from "@weth/agent";
import { GuardianChatService } from "../services/GuardianChatService.js";
import { AuditLogService } from "../services/AuditLogService.js";

const GuardianChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export default async function guardianChatRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/guardian/chat",
    {
      schema: {
        description: "Conversational AI endpoint routing natural language prompts to Guardian analyzers without LLM overhead.",
        tags: ["Guardian"],
        body: {
          type: "object",
          properties: {
            message: { type: "string" }
          },
          required: ["message"]
        }
      },
    },
    async (request, reply) => {
      try {
        const { message } = GuardianChatRequestSchema.parse(request.body);
        const routeResult = IntentRouter.route(message);

        let report: GuardianSecurityReport;
        let intentName = "UNKNOWN";

        if (routeResult.intent === GuardianIntent.ANALYZE_TRANSACTION) {
          intentName = "ANALYZE_TRANSACTION";
          const from = routeResult.extractedAddresses[0] || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
          const to =
            routeResult.extractedAddresses[1] ||
            routeResult.extractedAddresses[0] ||
            "0x00000000000000000000000000000000dead";
          const calldata = routeResult.calldata || "0x";
          report = await new TransactionAnalyzer().analyze({ from, to, value: "0", data: calldata });
        } else if (routeResult.intent === GuardianIntent.AUDIT_WALLET) {
          intentName = "AUDIT_WALLET";
          const address = routeResult.extractedAddresses[0] || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
          report = await new WalletAuditor().audit(address);
        } else if (routeResult.intent === GuardianIntent.ANALYZE_CONTRACT) {
          intentName = "ANALYZE_CONTRACT";
          const address = routeResult.extractedAddresses[0] || "0x00000000000000000000000000000000dead";
          report = await new ContractAnalyzer().analyze(address);
        } else {
          // UNKNOWN intent
          if (routeResult.extractedAddresses.length > 0) {
            intentName = "AUDIT_WALLET";
            report = await new WalletAuditor().audit(routeResult.extractedAddresses[0]);
          } else {
            intentName = "UNKNOWN";
            report = {
              summary: "Please provide a transaction calldata, wallet address, or contract address to analyze.",
              riskScore: 0,
              recommendation: "Safe to Proceed",
              findings: [],
              type: "wallet_audit",
              timestamp: new Date().toISOString(),
              formattedText: "No specific target detected.",
            };
          }
        }

        const assistantMessage =
          intentName === "UNKNOWN" && report.riskScore === 0 && report.findings.length === 0
            ? "Greetings from WETH Guardian. How can I assist you with blockchain security today? Please share a transaction, contract, or wallet address."
            : GuardianChatService.generateResponse(report);

        const responsePayload = {
          intent: intentName,
          assistantMessage,
          report,
        };

        await AuditLogService.logAudit(
          "POST /guardian/chat",
          { message },
          responsePayload,
          report.riskScore,
          report.recommendation
        );

        return reply.status(200).send(responsePayload);
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
