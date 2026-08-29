# WETH Demo & Usage Guide

This guide walks you through setting up and demonstrating the WETH project (Phase 3), showcasing the secure, human-in-the-loop workflow for AI agents interacting with Ethereum.

## 1. Initial Setup

Before starting the demo, ensure your environment is fully configured:

1. **Install Dependencies**:
   Ensure you have `pnpm` installed, then run:
   ```bash
   pnpm install
   ```

2. **Environment Configuration**:
   Copy the example environment file and fill in your details (such as your Alchemy API key for Sepolia):
   ```bash
   cp .env.example .env
   ```

3. **Start Infrastructure**:
   Launch PostgreSQL and Redis using Docker:
   ```bash
   docker-compose up -d
   ```

4. **Initialize the Database**:
   Generate Prisma clients and run migrations:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

## 2. Starting the Application

With the infrastructure running, launch all components (API, MCP Server, and Web Dashboard) concurrently from the workspace root:

```bash
pnpm dev
```
Wait for the services to boot up. The Next.js web dashboard will typically be available at `http://localhost:3000`.

## 3. The Demo Workflow (Human-in-the-Loop)

WETH is designed as a zero-trust execution layer. The AI can draft and simulate, but only the human can sign. Here is how to demonstrate the complete loop:

### Phase A: AI Drafting (via MCP)
1. **Connect your Agent**: Connect your MCP-compatible agent (like Claude Desktop) to the running WETH MCP Server.
2. **Interact**: Ask the AI to evaluate a wallet and draft a transaction on the Sepolia testnet.
   *Example Prompt*: "Analyze my token balances on Sepolia. I'd like to transfer 0.01 ETH to `0xRecipientAddress`. Please draft this transaction."
3. **Agent Sandbox**: The AI will use its permitted MCP tools (`Read`, `Analyze`, `Simulate`, `Draft`) to fetch real data via Alchemy Indexer APIs. It will simulate the gas costs and submit a draft.
4. **Policy Enforcement**: The Fastify backend intercepts this draft. If it violates safety rules (e.g., transferring > 10 ETH or to a blacklisted address), the backend rejects it. Otherwise, it is staged for human approval.

### Phase B: Human Execution (Web Dashboard)
1. **Open Dashboard**: Navigate to the Next.js frontend in your browser.
2. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask (ensure you are on the Sepolia testnet) via RainbowKit.
3. **Review Portfolio & Risk**: Explore the dashboard's analytics, powered by real token balances (`alchemy_getTokenBalances`) and transaction history (`alchemy_getAssetTransfers`). Show off the Concentration Risk and Diversification metrics.
4. **Approve Transaction**: Go to the Pending Transactions/Drafts view. You will see the transaction drafted by the AI.
5. **Sign & Broadcast**: Click to sign. MetaMask will pop up for confirmation. The Next.js frontend uses Wagmi's `useSendTransaction` to invoke the browser wallet. *Your private keys never leave your device.*
6. **Audit Logs**: After broadcasting, check the Audit Logs in the dashboard to see the finalized transaction securely recorded by Prisma.

## 4. Key Talking Points for Judges/Users
- **Non-Custodial Architecture**: Emphasize that the AI is sandboxed to 11 read/draft tools. It has absolutely no ability to sign transactions.
- **Production Grade**: Highlight the elimination of mocked data in favor of live Alchemy API integrations.
- **Seamless UX**: Show how the dark-mode Next.js dashboard bridges the gap between chat interfaces and secure blockchain execution.
