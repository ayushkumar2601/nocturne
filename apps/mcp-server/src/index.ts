import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ChainRouter } from '@weth/blockchain';
import { PrismaClient } from '@weth/database';
import { 
  GetBalanceInputSchema, 
  GetTokenBalancesInputSchema, 
  GetTransactionsInputSchema, 
  GetWalletSummaryInputSchema, 
  ResolveEnsInputSchema,
  EstimateGasInputSchema,
  SimulateTransactionInputSchema,
  CreateTransactionDraftInputSchema,
  AnalyzeTransactionRiskInputSchema,
  ApproveTransactionInputSchema,
  BroadcastTransactionInputSchema,
  AnalyzeWalletInputSchema,
  DetectRiskyApprovalsInputSchema,
  PolicyEngine,
  RiskEngine,
  PortfolioAnalyzer,
  ApprovalAnalyzer,
  logger,
  SupportedChain
} from '@weth/shared';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename_mcp = fileURLToPath(import.meta.url);
const __dirname_mcp = path.dirname(__filename_mcp);
dotenv.config({ path: path.resolve(__dirname_mcp, '../../.env') });
dotenv.config({ path: path.resolve(__dirname_mcp, '../../../.env') });
dotenv.config();

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('postgres:postgres@')) {
  process.env.DATABASE_URL = "postgresql://weth:weth_pass@localhost:5433/weth_db?schema=public";
}

const prisma = new PrismaClient();

const server = new Server(
  {
    name: "weth-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_balance",
        description: "Get the balance of an address on Ethereum (Sepolia) or Midnight testnet.",
        inputSchema: zodToJsonSchema(GetBalanceInputSchema),
      },
      {
        name: "get_token_balances",
        description: "Get ERC20 token balances for an address on Ethereum or Midnight.",
        inputSchema: zodToJsonSchema(GetTokenBalancesInputSchema),
      },
      {
        name: "get_transactions",
        description: "Get recent transactions for an address on Ethereum or Midnight.",
        inputSchema: zodToJsonSchema(GetTransactionsInputSchema),
      },
      {
        name: "get_wallet_summary",
        description: "Get a summary of a wallet including balance, token count, and recent activity (Ethereum or Midnight).",
        inputSchema: zodToJsonSchema(GetWalletSummaryInputSchema),
      },
      {
        name: "resolve_ens",
        description: "Resolve an ENS name to an address (Ethereum only).",
        inputSchema: zodToJsonSchema(ResolveEnsInputSchema),
      },
      {
        name: "estimate_gas",
        description: "Estimate gas costs for a transaction on Ethereum or Midnight.",
        inputSchema: zodToJsonSchema(EstimateGasInputSchema),
      },
      {
        name: "simulate_transaction",
        description: "Simulate a transaction execution on Ethereum (Sepolia) or Midnight without broadcasting.",
        inputSchema: zodToJsonSchema(SimulateTransactionInputSchema),
      },
      {
        name: "create_transaction_draft",
        description: "Create a draft transaction on Ethereum or Midnight that requires human approval.",
        inputSchema: zodToJsonSchema(CreateTransactionDraftInputSchema),
      },
      {
        name: "analyze_transaction_risk",
        description: "Analyze risk and policy for a transaction draft.",
        inputSchema: zodToJsonSchema(AnalyzeTransactionRiskInputSchema),
      },
      {
        name: "approve_transaction",
        description: "Approve a drafted transaction for signing. State change only.",
        inputSchema: zodToJsonSchema(ApproveTransactionInputSchema),
      },
      {
        name: "broadcast_transaction",
        description: "Broadcast a raw signed transaction to Ethereum or Midnight.",
        inputSchema: zodToJsonSchema(BroadcastTransactionInputSchema),
      },
      {
        name: "analyze_wallet",
        description: "Analyze wallet portfolio and asset allocation risk.",
        inputSchema: zodToJsonSchema(AnalyzeWalletInputSchema),
      },
      {
        name: "detect_risky_approvals",
        description: "Scan wallet history for risky ERC20 allowances and interactions.",
        inputSchema: zodToJsonSchema(DetectRiskyApprovalsInputSchema),
      }
    ],
  };
});

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
    logger.error({ err, toolName }, 'Failed to create audit log');
  }
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result: any;
  let transactionId: string | undefined;

  try {
    switch (name) {
      case "get_balance": {
        const parsed = GetBalanceInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.getBalance(chain, parsed.address);
        break;
      }
      case "get_token_balances": {
        const parsed = GetTokenBalancesInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.getTokenBalances(chain, parsed.address);
        break;
      }
      case "get_transactions": {
        const parsed = GetTransactionsInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.getTransactions(chain, parsed.address);
        break;
      }
      case "get_wallet_summary": {
        const parsed = GetWalletSummaryInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        const [balance, tokens, txs] = await Promise.all([
          ChainRouter.getBalance(chain, parsed.address),
          ChainRouter.getTokenBalances(chain, parsed.address),
          ChainRouter.getTransactions(chain, parsed.address)
        ]);
        const analytics = PortfolioAnalyzer.analyze(balance.eth, tokens);
        result = {
          ethBalance: balance.eth,
          tokenCount: tokens.length,
          recentActivity: txs.length,
          portfolioRiskLevel: analytics.riskLevel,
          diversificationLevel: analytics.diversificationLevel
        };
        break;
      }
      case "resolve_ens": {
        const parsed = ResolveEnsInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.resolveEns(chain, parsed.name);
        break;
      }
      case "estimate_gas": {
        const parsed = EstimateGasInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.estimateGas(chain, parsed);
        break;
      }
      case "simulate_transaction": {
        const parsed = SimulateTransactionInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.simulateTransaction(chain, parsed);
        break;
      }
      case "create_transaction_draft": {
        const parsed = CreateTransactionDraftInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        
        // 1. Estimate
        const estimate = await ChainRouter.estimateGas(chain, parsed);
        
        // 2. Draft
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
        transactionId = draft.id;
        result = { draftId: draft.id, status: draft.status, estimate, chain };
        break;
      }
      case "analyze_transaction_risk": {
        const parsed = AnalyzeTransactionRiskInputSchema.parse(args);
        transactionId = parsed.draftId;
        
        const draft = await prisma.transactionDraft.findUnique({ where: { id: parsed.draftId } });
        if (!draft) throw new Error("Draft not found");
        
        const chain = (draft.chain as SupportedChain) || SupportedChain.ETHEREUM;
        // Simulate
        const simulation = await ChainRouter.simulateTransaction(chain, {
          from: draft.fromAddress,
          to: draft.toAddress,
          value: draft.value,
          data: draft.data || undefined
        });
        
        // Policy
        const policy = PolicyEngine.evaluateTransaction({
          to: draft.toAddress,
          value: draft.value,
          isUnknownContract: !!draft.data && draft.data !== '0x'
        });
        
        // Risk
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
        
        result = { simulation, policy, risk, chain };
        break;
      }
      case "approve_transaction": {
        const parsed = ApproveTransactionInputSchema.parse(args);
        transactionId = parsed.draftId;
        const draft = await prisma.transactionDraft.findUnique({ where: { id: parsed.draftId } });
        if (!draft) throw new Error("Draft not found");
        if (draft.policyResult === 'BLOCKED') throw new Error("Cannot approve blocked transaction");
        
        const updated = await prisma.transactionDraft.update({
          where: { id: draft.id },
          data: { status: "APPROVED" }
        });
        result = { status: updated.status, message: "Transaction approved for external signing.", chain: updated.chain };
        break;
      }
      case "broadcast_transaction": {
        const parsed = BroadcastTransactionInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        result = await ChainRouter.broadcastTransaction(chain, parsed.signedTransaction);
        if (parsed.draftId) {
          await prisma.transactionDraft.update({
            where: { id: parsed.draftId },
            data: { status: "BROADCASTED" }
          });
        }
        transactionId = parsed.draftId;
        break;
      }
      case "analyze_wallet": {
        const parsed = AnalyzeWalletInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        const [balance, tokens] = await Promise.all([
          ChainRouter.getBalance(chain, parsed.address),
          ChainRouter.getTokenBalances(chain, parsed.address)
        ]);
        result = PortfolioAnalyzer.analyze(balance.eth, tokens);
        break;
      }
      case "detect_risky_approvals": {
        const parsed = DetectRiskyApprovalsInputSchema.parse(args);
        const chain = parsed.chain || SupportedChain.ETHEREUM;
        const txs = await ChainRouter.getTransactions(chain, parsed.address);
        result = ApprovalAnalyzer.analyzeApprovals(txs);
        break;
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    // Fire & Forget Audit
    auditAction(name, args, result, transactionId);

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error: any) {
    logger.error({ err: error, tool: name, args }, "Tool execution error");
    
    // Fire & Forget Error Audit
    auditAction(name, args, { error: error.message }, transactionId);
    
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("WETH MCP Server running on stdio");
}

run().catch((error) => {
  logger.fatal({ err: error }, "Server failed to start");
  process.exit(1);
});
