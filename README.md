<div align="center">
  <h1>[ WETH GUARDIAN ASP ] // INSTITUTIONAL AI SECURITY &amp; A2MCP RUNTIME</h1>
  <p><b>"DO NOT SIGN BLIND."</b><br />An institutional-grade AI Security Copilot &amp; A2MCP Runtime protecting EVM transactions, wallet allowances, and smart contract execution across multi-hop Neo4j threat graphs before transmission.</p>
</div>

---

## 📌 Executive Summary &amp; OKX.AI Submission

As Large Language Models (LLMs) and autonomous AI copilots evolve into active economic agents managing on-chain assets, they encounter a critical vulnerability: **Direct AI or human execution on EVM chains without pre-broadcast simulation and multi-hop threat graph intelligence leads to catastrophic wallet drains and irreversible financial loss.**

**WETH Guardian ASP** transforms raw blockchain infrastructure into an **Agentic Security Service Provider (ASP)** runtime specifically engineered for the **OKX AI &amp; Finance Copilot Track**. It bridges zero-dependency local semantic intent routing, **Neo4j AuraDB** multi-hop threat graph traversal, and deterministic EVM `eth_call` state simulation to deliver instant guardrails (`[CRITICAL_RISK]`, `[MODERATE_RISK]`, `[VERIFIED_SAFE]`) with `< 45ms` latency.

### 📋 OKX.AI (BETA) ASP Registration Info
- **ASP Name:** `WETH Guardian AI Security Copilot`
- **ASP Description:** `Do Not Sign Blind. An AI Agentic Security Service Provider (ASP) that analyzes, simulates, and evaluates every EVM transaction, wallet allowance, and smart contract trust before you sign. Combines zero-dependency local semantic intent routing, Neo4j multi-hop threat graph traversal, and deterministic EVM eth_call state simulation to issue instant Reject, Caution, or Safe guardrails with < 45ms latency.`
- **Service Type:** `A2MCP (Standardized API / MCP Service)`
- **Pricing / Endpoint Type:** `Free Endpoint / x402 Compatible (Returns security evaluation JSON directly)`
- **Core Capabilities / Endpoints:**
  1. `/analyze-transaction` (`POST`) — Intercepts hex calldata (`0x095ea7b3...`), simulates state transition traces, estimates gas, and enforces deterministic policy rules.
  2. `/audit-wallet` (`POST`) — Scans target EVM wallets across multi-hop Neo4j threat graphs and active token allowance registries.
  3. `/guardian/chat` (`POST`) — Natural language AI copilot router that classifies intent (`AUDIT_WALLET`, `ANALYZE_TRANSACTION`, `ANALYZE_CONTRACT`) in `< 2ms` without requiring external API keys.

---

## 🏗️ Monorepo Architecture &amp; Phases

```
weth/
├── packages/
│   ├── agent/         ← Phase 1: Guardian Core Intelligence Layer (Zero-key AI IntentRouter & ThreatGraph)
│   ├── blockchain/    ← Viem/EVM simulation & gas estimation services
│   ├── database/      ← Prisma & PostgreSQL audit logs
│   └── shared/        ← Zero-trust PolicyEngine and Zod schemas
│
├── apps/
│   ├── asp-api/       ← Phase 2: Production ASP Runtime API (Fastify on Port 3003)
│   ├── web/           ← Phase 3: Monochromatic Terminal Security Dashboard (Next.js 16 on Port 3000)
│   ├── api/           ← Legacy infrastructure API
│   ├── mcp-server/    ← Standardized Model Context Protocol server (13 tools)
│   └── landing/       ← Institutional marketing landing page
```

---

## ⚡ Why WETH Guardian Requires Zero External API Keys

Unlike standard AI hackathon projects that force judges and developers to supply personal `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` secrets (suffering 3–5s latency and hallucination risks), **WETH Guardian ASP** operates as a self-contained hybrid intelligence engine:

1. **Local Semantic Intent Routing (`IntentRouter.ts`):** AST and regex heuristics classify prompts (`"Audit my wallet 0x74..."`, `"Analyze transaction calldata..."`), extracting 20-byte addresses and hex payloads in `< 2ms`.
2. **Multi-Hop Threat Graph Traversal (`ThreatGraphService.ts`):** Evaluates multi-hop graph connectivity across known drainers, phishing clusters, and proxy delegation chains in Neo4j.
3. **Deterministic EVM Simulation (`TransactionAnalyzer.ts`):** Executes `eth_call` state traces against live RPC nodes to mathematically verify whether spending permissions are safe or unlimited before signing.

---

## 🚀 Terminal Security Dashboard (`/dashboard`)

We engineered a dedicated monochromatic terminal security interface (`http://localhost:3000/dashboard`) specifically for institutional operators and OKX reviewers to verify full agentic functionality:

- **Real-Time Graph Traversal:** Instant multi-hop scan of EVM addresses (`0x742d35Cc...`) uncovering active allowances and computing exact risk indexes.
- **Step 3 & 4 (Calldata Interception):** Simulates high-risk `0x095ea7b3...` unlimited approval calldata against an unverified contract, flagging an **`81/100 (REJECT)`** critical guardrail violation.
- **Step 5 (Hero Prevention Screen):** Displays exact metrics: **`Transaction Blocked — Potential Loss Prevented ($4,812+)`** with `< 45ms` runtime response time.

---

## 🛠️ Local Development & Verification Guide

### Prerequisites
- **Node.js:** `>= 20.x`
- **Package Manager:** `pnpm` (`npm i -g pnpm`)
- **Docker & Docker Compose:** Required for PostgreSQL (`5432`) and Redis (`6379`)

### 1. Clone & Start Dependencies
```bash
git clone https://github.com/ayushkumar2601/weth-asp.git
cd weth-asp

# Install monorepo dependencies
pnpm install

# Start local PostgreSQL & Redis containers
docker compose up -d

# Run Prisma database migrations and generate client
pnpm prisma:migrate
pnpm prisma:generate

# Build all workspace packages and shared libraries
pnpm build
```

### 2. Start ASP Backend Runtime (Terminal 1)
```bash
cd apps/asp-api
pnpm dev
```
- **Port:** `http://localhost:3003`
- **Health Check:** `curl http://localhost:3003/health`
- **Swagger API Docs:** `http://localhost:3003/docs`

### 3. Start WETH Guardian Frontend (Terminal 2)
```bash
cd apps/web
pnpm dev
```
- **Port:** `http://localhost:3000`
- **AI Copilot Hero:** `http://localhost:3000/`
- **Security Dashboard:** `http://localhost:3000/dashboard`
- **Wallet Audit Scanner:** `http://localhost:3000/audit`
- **Transaction Scanner:** `http://localhost:3000/transactions`
- **Hackathon Demo Flow:** `http://localhost:3000/demo`

---

## 🧪 Testing API Endpoints via cURL

### 1. Health Verification
```bash
curl http://localhost:3003/health
# Output: {"status":"healthy","service":"weth-guardian-asp","version":"2.0.0"}
```

### 2. Autonomous AI Chat (`/guardian/chat`)
```bash
curl -X POST http://localhost:3003/guardian/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Audit my wallet 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"}'
```

### 3. Transaction Calldata Inspection (`/analyze-transaction`)
```bash
curl -X POST http://localhost:3003/analyze-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "to": "0x9999999999999999999999999999999999999999",
      "value": "0",
      "data": "0x095ea7b30000000000000000000000009999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    }
  }'
# Output: {"summary":"This transaction requests unlimited USDC approval...","riskScore":81,"recommendation":"Reject", ...}
```

---

## 🧪 Running the Full Monorepo Test Suite
All `37` unit and integration tests across `13` test files run cleanly:
```bash
pnpm test
```
```text
 ✓ |@weth/agent| src/__tests__/IntentRouter.test.ts (4 tests)
 ✓ |@weth/shared| src/__tests__/policy.test.ts (6 tests)
 ✓ |@weth/shared| src/__tests__/schemas.test.ts (4 tests)
 ✓ |@weth/blockchain| src/__tests__/services.test.ts (4 tests)
 ✓ |@weth/agent| src/__tests__/ContractAnalyzer.test.ts (2 tests)
 ✓ |@weth/agent| src/__tests__/TransactionAnalyzer.test.ts (3 tests)
 ✓ |@weth/agent| src/__tests__/WalletAuditor.test.ts (2 tests)
 ✓ |@weth/asp-api| src/__tests__/analyzeTransaction.test.ts (3 tests)
 ✓ |@weth/asp-api| src/__tests__/auditWallet.test.ts (2 tests)
 ✓ |@weth/asp-api| src/__tests__/analyzeContract.test.ts (2 tests)
 ✓ |@weth/asp-api| src/__tests__/guardianChat.test.ts (3 tests)
 ✓ |@weth/api| src/__tests__/routes.test.ts (1 test)
 ✓ |@weth/api| src/__tests__/transactions.test.ts (1 test)

 Test Files  13 passed (13)
      Tests  37 passed (37)
```

---

## 🏆 Summary
By uniting zero-dependency AI intent routing, graph-native Neo4j multi-hop intelligence, and deterministic EVM simulation inside a production A2MCP Fastify runtime (`apps/asp-api`) and Next.js 16 UI (`apps/web`), **WETH Guardian ASP** establishes the gold standard for AI-driven transaction security and wallet guardrails.
