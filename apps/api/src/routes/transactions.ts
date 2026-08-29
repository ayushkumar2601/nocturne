import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@weth/database';
import { ChainRouter } from '@weth/blockchain';
import { 
  PolicyEngine, RiskEngine,
  EstimateGasInputSchema, SimulateTransactionInputSchema,
  CreateTransactionDraftInputSchema, AnalyzeTransactionRiskInputSchema,
  ApproveTransactionInputSchema, BroadcastTransactionInputSchema,
  logger,
  SupportedChain
} from '@weth/shared';

const prisma = new PrismaClient();

async function auditAction(toolName: string, requestPayload: any, responsePayload: any, transactionId?: string) {
  try {
    await prisma.transactionAudit.create({
      data: {
        toolName,
        requestPayload: JSON.parse(JSON.stringify(requestPayload)),
        responsePayload: JSON.parse(JSON.stringify(responsePayload)),
        transactionId
      }
    });
  } catch (err) {
    logger.error({ err, toolName }, 'Failed to create audit log in API');
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.post('/estimate-gas', async (request, reply) => {
    try {
      const parsed = EstimateGasInputSchema.parse(request.body);
      const chain = parsed.chain || SupportedChain.ETHEREUM;
      const result = await ChainRouter.estimateGas(chain, parsed);
      auditAction('api:estimate-gas', parsed, result);
      return result;
    } catch (err: any) {
      auditAction('api:estimate-gas', request.body, { error: err.message });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/simulate', async (request, reply) => {
    try {
      const parsed = SimulateTransactionInputSchema.parse(request.body);
      const chain = parsed.chain || SupportedChain.ETHEREUM;
      const result = await ChainRouter.simulateTransaction(chain, parsed);
      auditAction('api:simulate', parsed, result);
      return result;
    } catch (err: any) {
      auditAction('api:simulate', request.body, { error: err.message });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/draft', async (request, reply) => {
    try {
      const parsed = CreateTransactionDraftInputSchema.parse(request.body);
      const chain = parsed.chain || SupportedChain.ETHEREUM;
      const estimate = await ChainRouter.estimateGas(chain, parsed);
      
      const draft = await prisma.transactionDraft.create({
        data: {
          chain,
          chainId: chain === SupportedChain.MIDNIGHT ? 8888 : 11155111,
          fromAddress: parsed.from,
          toAddress: parsed.to,
          value: parsed.value,
          data: parsed.data || '0x',
          gasEstimate: estimate as any,
          status: "PENDING_APPROVAL"
        }
      });
      const result = { draftId: draft.id, status: draft.status, estimate, chain };
      auditAction('api:draft', parsed, result, draft.id);
      return result;
    } catch (err: any) {
      auditAction('api:draft', request.body, { error: err.message });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/analyze', async (request, reply) => {
    try {
      const parsed = AnalyzeTransactionRiskInputSchema.parse(request.body);
      const draft = await prisma.transactionDraft.findUnique({ where: { id: parsed.draftId } });
      if (!draft) throw new Error("Draft not found");

      const chain = (draft.chain as SupportedChain) || SupportedChain.ETHEREUM;
      const simulation = await ChainRouter.simulateTransaction(chain, {
        from: draft.fromAddress,
        to: draft.toAddress,
        value: draft.value,
        data: draft.data || undefined
      });

      const policy = PolicyEngine.evaluateTransaction({
        to: draft.toAddress,
        value: draft.value,
        isUnknownContract: !!draft.data && draft.data !== '0x'
      });

      const risk = RiskEngine.assessTransaction({
        to: draft.toAddress,
        value: draft.value,
        hasData: !!draft.data && draft.data !== '0x',
        isUnknownContract: !!draft.data && draft.data !== '0x',
        simulationFailed: !simulation.success
      });

      await prisma.policyDecision.create({
        data: {
          transactionId: draft.id,
          result: policy.result,
          reason: policy.reason
        }
      });

      await prisma.transactionDraft.update({
        where: { id: draft.id },
        data: {
          status: policy.result === 'BLOCKED' ? 'REJECTED' : 'SIMULATED',
          simulationResult: simulation as any,
          riskLevel: risk.level,
          policyResult: policy.result
        }
      });

      const result = { simulation, policy, risk, chain };
      auditAction('api:analyze', parsed, result, draft.id);
      return result;
    } catch (err: any) {
      auditAction('api:analyze', request.body, { error: err.message });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/approve', async (request, reply) => {
    try {
      const parsed = ApproveTransactionInputSchema.parse(request.body);
      const draft = await prisma.transactionDraft.findUnique({ where: { id: parsed.draftId } });
      if (!draft) throw new Error("Draft not found");
      if (draft.policyResult === 'BLOCKED') throw new Error("Cannot approve blocked transaction");
      
      const updated = await prisma.transactionDraft.update({
        where: { id: draft.id },
        data: { status: "APPROVED" }
      });
      const result = { status: updated.status, message: "Transaction approved for external signing.", chain: updated.chain };
      auditAction('api:approve', parsed, result, draft.id);
      return result;
    } catch (err: any) {
      auditAction('api:approve', request.body, { error: err.message });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/broadcast', async (request, reply) => {
    try {
      const parsed = BroadcastTransactionInputSchema.parse(request.body);
      const chain = parsed.chain || SupportedChain.ETHEREUM;
      
      let hash = parsed.signedTransaction;
      let result: any = { success: true };

      // If it's longer than a standard 32-byte hash (66 chars with 0x), it's a raw signed tx that needs broadcasting
      if (parsed.signedTransaction.length > 66) {
        result = await ChainRouter.broadcastTransaction(chain, parsed.signedTransaction);
        hash = result.hash || hash;
      } else {
        result.hash = hash;
      }

      
      if (parsed.draftId) {
        await prisma.transactionDraft.update({
          where: { id: parsed.draftId },
          data: { status: "BROADCASTED" }
        });
      }

      auditAction('api:broadcast', parsed, result, parsed.draftId);
      return result;
    } catch (err: any) {
      auditAction('api:broadcast', request.body, { error: err.message });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const draft = await prisma.transactionDraft.findUnique({ where: { id } });
    if (!draft) return reply.status(404).send({ error: "Not found" });
    return draft;
  });

  fastify.get('/:id/audit', async (request, reply) => {
    const { id } = request.params as any;
    const audits = await prisma.transactionAudit.findMany({ where: { transactionId: id } });
    return audits;
  });

  fastify.get('/audit/all', async (request, reply) => {
    const audits = await prisma.transactionAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return audits;
  });

  fastify.get('/pending/:address', async (request, reply) => {
    const { address } = request.params as any;
    const drafts = await prisma.transactionDraft.findMany({
      where: {
        fromAddress: { equals: address, mode: 'insensitive' },
        status: { in: ["DRAFT", "PENDING_APPROVAL", "APPROVED", "SIMULATED"] }
      },
      orderBy: { createdAt: 'desc' }
    });
    return drafts;
  });
}
