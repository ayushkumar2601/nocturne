# WETH Guardian ASP — Master Migration & Technical Specification

> **From MCP Infrastructure to an AI Security Copilot for OKX**  
> **Target Timeline:** 6-Hour Hackathon Execution (Shipping Milestones)  
> **Primary Goal:** Pass OKX review, deliver a stunning 90-second live demo, and win the Finance Copilot track.

---

## Executive Summary & Architecture Shift

Currently, **WETH** (`v1.0.0`) is a solid, zero-trust infrastructure layer that provides Model Context Protocol (MCP) tools for LLMs (`apps/mcp-server`), a core EVM execution/simulation backend (`apps/api`), and a human-in-the-loop signing console (`apps/web`).

However, infrastructure alone does not win AI copilot tracks—**products do**.  
To win the **Finance Copilot track** and seamlessly integrate with **OKX**, we must evolve WETH from raw tool infrastructure into **WETH Guardian ASP (AI Security Platform)**: an autonomous, highly consumable AI Security Copilot that ingests raw blockchain data, runs quantitative risk and graph analysis, explains complex threats in plain English, and delivers instant, actionable security recommendations.

```
+-----------------------------------------------------------------------------------+
|                           WETH GUARDIAN ASP ARCHITECTURE                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ User / OKX Client / Hackathon Judge ]                                          |
|         |                                                                         |
|         v                                                                         |
|  +-----------------------------------------------------------------------------+  |
|  | PHASE 3: OKX-Facing Product Experience (apps/web)                           |  |
|  |  • Guardian AI Chat UI (Natural language + structured security cards)       |  |
|  |  • Security Dashboard (Wallet Score: 72/100, Recent Analyses, Threat Alerts)|  |
|  |  • 90-Second Guided Demo Flow (Audit Wallet -> Show Findings -> Reject Tx)  |  |
|  +-----------------------------------------------------------------------------+  |
|         | HTTP REST / WebSocket                                                   |
|         v                                                                         |
|  +-----------------------------------------------------------------------------+  |
|  | PHASE 2: ASP Service Layer (apps/asp-api - Port 3003)                       |  |
|  |  • POST /analyze-transaction (Transaction Guardian Service)                 |  |
|  |  • POST /audit-wallet        (Wallet Security Audit Service)                |  |
|  |  • POST /analyze-contract    (Contract Trust Analysis Service)              |  |
|  |  • POST /guardian/chat       (Unified Intent-Driven AI Router)              |  |
|  +-----------------------------------------------------------------------------+  |
|         | Internal Package API                                                    |
|         v                                                                         |
|  +-----------------------------------------------------------------------------+  |
|  | PHASE 1: Guardian Core Intelligence Layer (packages/agent)                  |  |
|  |  • IntentRouter            (Classify prompts into Tx/Wallet/Contract goals) |  |
|  |  • ThreatGraphService      (Neo4j AuraDB + in-memory threat topology graph) |  |
|  |  • SecurityReportGenerator (Convert raw {risk: 81} -> Human Advice & Cards) |  |
|  |  • Domain Analyzers:                                                        |
|  |      - TransactionAnalyzer (Simulate + Risk Score + Policy + Threat check)  |
|  |      - WalletAuditor       (Score 0-100 + Exposure calculation + Allowances)|  |
|  |      - ContractAnalyzer    (Verification check + Risk heuristics + Wallets) |  |
|  +-----------------------------------------------------------------------------+  |
|         | Uses Existing Infrastructure                                            |
|         v                                                                         |
|  +-----------------------------------------------------------------------------+  |
|  | EXISTING FOUNDATION (@weth/shared, @weth/blockchain, @weth/database)        |  |
|  |  • PolicyEngine & RiskEngine (0-100 Score, Zod rules, ApprovalAnalyzer)     |  |
|  |  • TransactionExecutionService (Viem simulation, gas estimation, eth_call)  |  |
|  |  • Prisma Postgres (Transaction drafts, audit trails, cache, policy logs)   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## Standardized Intelligence Output Contract

Every core service across Phase 1 and Phase 2 adheres strictly to a unified TypeScript contract (`GuardianSecurityReport`). Whether a user analyzes a transaction, audits a wallet, or inspects a contract, the return format is uniform, parseable, and ready for rich UI rendering:

```typescript
export type GuardianRecommendation = 
  | 'Reject' 
  | 'Approve' 
  | 'Caution' 
  | 'Revoke Immediately' 
  | 'Safe to Proceed';

export interface GuardianFinding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface GuardianSecurityReport {
  summary: string;
  riskScore: number;          // Quantitative risk score from 0 (Safe) to 100 (Critical Threat)
  recommendation: GuardianRecommendation;
  findings: GuardianFinding[];
  type: 'transaction' | 'wallet_audit' | 'contract_analysis';
  timestamp: string;
  formattedText: string;      // Human-readable plain text block (e.g., for terminal/OKX summary)
  rawContext?: Record<string, any>;
}
```

---

## Detailed Shipping Milestones & Technical Specifications

### Phase 1 — Guardian Core Intelligence Layer (`packages/agent`)

**Objective:** Transform raw blockchain outputs, Viem simulations, and policy evaluations into coherent, explanation-driven security intelligence.

#### 1. Directory Structure & Workspace Registration
Create package `@weth/agent` at `packages/agent`:
```text
packages/agent/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── intents/
    │   └── IntentRouter.ts
    ├── services/
    │   ├── ThreatGraphService.ts
    │   ├── TransactionAnalyzer.ts
    │   ├── WalletAuditor.ts
    │   └── ContractAnalyzer.ts
    ├── generators/
    │   └── SecurityReportGenerator.ts
    └── __tests__/
        ├── IntentRouter.test.ts
        ├── TransactionAnalyzer.test.ts
        └── WalletAuditor.test.ts
```

#### 2. Key Responsibilities & Module Specifications

##### A. Intent Router (`IntentRouter.ts`)
- Classifies user input (both structured JSON and natural language) into one of three core intents:
  1. **`ANALYZE_TRANSACTION`** (e.g., `"Analyze this transaction"`, `"Check this calldata to contract X"`, or draft payload).
  2. **`AUDIT_WALLET`** (e.g., `"Audit my wallet 0xabc..."`, `"Check security for my account"`).
  3. **`ANALYZE_CONTRACT`** (e.g., `"Analyze this contract 0xdef..."`, `"Is contract X trustworthy?"`).
- Uses regex, keyword patterns, and address/calldata extraction with fallback support for LLM/system prompts when embedded inside MCP/Chat.

##### B. Threat Graph Engine (`ThreatGraphService.ts`)
- Connects to **Neo4j AuraDB** using `@neo4j/driver` (when environment variables `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` are provided).
- Implements a resilient **InMemoryGraphFallback** seeded with known threat topologies (e.g., drainer contracts like `0x00000000000000000000000000000000dead`, known phishing spreaders, multi-hop unlimited approval recipients) so the system works 100% reliably during local development and live demonstrations even without active Neo4j connectivity.
- Provides queries:
  - `checkAddressExposure(address: string)` -> Returns direct & multi-hop threat connections.
  - `getRelatedThreatWallets(contractAddress: string)` -> Returns count and addresses of compromised wallets connected to the target.

##### C. Domain Analyzers
1. **`TransactionAnalyzer.ts`**:
   - Takes transaction parameters (`from`, `to`, `value`, `data`).
   - Runs `TransactionExecutionService.simulateTransaction` (`eth_call`).
   - Runs `PolicyEngine.evaluateTransaction` & `RiskEngine.assessTransaction`.
   - Queries `ThreatGraphService` for spender/target contract reputation.
   - Computes a blended 0–100 risk score (e.g., unlimited approval to unknown contract = `81/100`).
   - Invokes `SecurityReportGenerator` to produce the final `GuardianSecurityReport`.
2. **`WalletAuditor.ts`**:
   - Takes a wallet address (`0x...`).
   - Queries `BalanceService` (ETH & ERC20 tokens) and `TransactionService`.
   - Runs `ApprovalAnalyzer.analyzeApprovals` to detect active unlimited approvals.
   - Calculates total financial exposure ($ value at risk across vulnerable approvals).
   - Computes an overall **Wallet Security Score** (`100 - penalties`). For example, 3 unlimited approvals + 1 suspicious interaction = `72/100`.
3. **`ContractAnalyzer.ts`**:
   - Takes a contract address.
   - Checks bytecode verification status (`0x` vs verified contract heuristics).
   - Queries `ThreatGraphService` to identify how many victim/threat wallets have interacted with it.
   - Assigns a trust tier (`Verified / High Trust`, `Medium Risk`, `Critical Threat`).

##### D. Report Generator (`SecurityReportGenerator.ts`)
- Converts structured findings into crisp, punchy summaries.
- For example, transforming `{ risk: 81 }` into:
  ```text
  This transaction requests unlimited USDC approval.

  The contract will retain spending permissions.

  Risk Score: 81/100

  Recommendation: Reject
  ```

---

### Phase 2 — ASP Service Layer (`apps/asp-api`)

**Objective:** Package the intelligence layer into production-ready REST endpoints tailored for OKX, external applications, and the Guardian Chat frontend.

#### 1. Directory Structure
Create app `@weth/asp-api` at `apps/asp-api` (running on port `3003`):
```text
apps/asp-api/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── routes/
    │   ├── analyzeTransaction.ts
    │   ├── auditWallet.ts
    │   ├── analyzeContract.ts
    │   ├── guardianChat.ts
    │   └── health.ts
    └── __tests__/
        └── endpoints.test.ts
```

#### 2. REST API Endpoints Specification

##### A. Transaction Guardian (`POST /analyze-transaction`)
- **Input:**
  ```json
  {
    "prompt": "Analyze this transaction",
    "transaction": {
      "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "to": "0x00000000000000000000000000000000dead",
      "value": "0",
      "data": "0x095ea7b30000000000000000000000009999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    }
  }
  ```
- **Output:** `GuardianSecurityReport` with `riskScore: 81`, `recommendation: "Reject"`, and `formattedText`:
  ```text
  Type: USDC Approval
  Risk: 81/100
  Recommendation: Reject
  ```

##### B. Wallet Security Audit (`POST /audit-wallet`)
- **Input:**
  ```json
  {
    "prompt": "Audit my wallet",
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  }
  ```
- **Output:** `GuardianSecurityReport` with `riskScore: 28` (meaning Wallet Score 72/100), and `formattedText`:
  ```text
  Wallet Score: 72/100
  Issues: 3 Unlimited Approvals
  Exposure: $4,812
  ```

##### C. Contract Trust Analysis (`POST /analyze-contract`)
- **Input:**
  ```json
  {
    "prompt": "Analyze this contract",
    "contractAddress": "0x9999999999999999999999999999999999999999"
  }
  ```
- **Output:** `GuardianSecurityReport` with `formattedText`:
  ```text
  Verification: Verified
  Trust: Medium Risk
  Related Threat Wallets: 12
  ```

##### D. Unified Guardian AI Chat Endpoint (`POST /guardian/chat`)
- **Input:** `{ "message": "Analyze this transaction ...", "context": { ... } }`
- Automatically passes through `IntentRouter`, routes to the corresponding analyzer, logs an audit entry to Postgres, and returns both the structured report and a conversational assistant response.

---

### Phase 3 — OKX-Facing Product Experience (`apps/web`)

**Objective:** Transform the web app from a passive "Signing Console" into a cutting-edge **AI Security Copilot** and **Security Dashboard** tailored for a 90-second hackathon demo.

#### 1. Key Features & Pages to Add/Upgrade in `apps/web`

##### A. Guardian AI Chat Page (`/chat` or Main Index `/`)
- **Vibrant AI Copilot Interface:**
  - Dark/Light mode support with glowing neon accents (emerald for safe, amber for caution, rose/crimson for high risk).
  - **Quick Action Chips:** `🔍 Audit My Wallet`, `⚡ Analyze Transaction`, `🛡️ Check Contract Trust`.
  - **Chat Message Feed:**
    - User messages rendered cleanly.
    - Guardian AI messages rendered as **Interactive Security Cards** showing:
      - **Risk Gauge / Score Badge:** e.g., `⚠️ High Risk — 81/100`
      - **Core Summary Block:** Plain English explanation without jargon overload.
      - **Findings Breakdown:** Collapsible/expandable list of exact policy and threat violations.
      - **Action Buttons:** `🚫 Reject Transaction` (red button), `✅ Approve & Sign` (green button), or `🔒 Revoke Allowance`.

##### B. Security Dashboard (`/dashboard` & `/audit`)
- **Wallet Health Gauge (Top Widget):** Large, visual score ring showing `72/100` alongside status (`Needs Attention`).
- **Exposure Metric Card:** Total financial risk (`$4,812` across 3 unlimited token allowances) with a one-click `Review & Revoke` trigger.
- **Recent Analyses History Feed:** Live table/list showing recent audits (`Transaction`, `Contract`, `Wallet`) with risk pills (`81/100`, `72/100`, `Verified`).
- **Live Threat Alerts Ticker:** Real-time alert feed showing detected graph threats (`Unlimited Approval Found to 0xdead...`).

##### C. The 60–90 Second Hackathon Demo Flow
To guarantee a flawless live presentation for OKX judges, we will build a **Demo Mode (`/demo`)** or integrated quick-trigger flow:
1. **Step 1 (0:00 - 0:15): Open Guardian & Paste Wallet**
   - User enters demo wallet address (`0x742d...f44e`) and clicks **Audit Wallet**.
2. **Step 2 (0:15 - 0:35): Show Wallet Score & Findings**
   - Instant visual report appears: **Score: 72/100**, **Issues: 3 Unlimited Approvals**, **Exposure: $4,812**.
3. **Step 3 (0:35 - 0:60): Paste Suspicious Transaction**
   - User clicks `Analyze Transaction` and inputs an ERC20 `approve(unlimited)` payload targeting an unknown spender contract.
4. **Step 4 (0:60 - 0:90): Show Risk Explanation & Recommendation**
   - Guardian analyzes simulation + threat graph and outputs:  
     `⚠️ High Risk (81/100). This transaction requests unlimited USDC approval. The contract will retain spending permissions. Recommendation: Reject.`
   - User clicks **Reject Transaction** in one click, demonstrating complete zero-trust protection.

---

## Complete Implementation Roadmap (Step-by-Step)

Once this documentation is approved, implementation follows this exact chronological sequence:

### Step 1: Build Phase 1 (`@weth/agent`)
1. Create `packages/agent` directory, `package.json`, and `tsconfig.json`.
2. Implement `ThreatGraphService.ts` with Neo4j driver plus robust in-memory fallback.
3. Implement `IntentRouter.ts` with precise classification logic.
4. Implement `SecurityReportGenerator.ts` to enforce the standardized `GuardianSecurityReport` output.
5. Implement `TransactionAnalyzer.ts`, `WalletAuditor.ts`, and `ContractAnalyzer.ts`.
6. Write unit tests inside `packages/agent/src/__tests__/` and verify with `vitest`.

### Step 2: Build Phase 2 (`@weth/asp-api`)
1. Create `apps/asp-api` directory, `package.json`, and `tsconfig.json`.
2. Implement Fastify server and endpoints: `/analyze-transaction`, `/audit-wallet`, `/analyze-contract`, and `/guardian/chat`.
3. Connect `@weth/asp-api` to `@weth/agent` and `@weth/database`.
4. Verify endpoint responses using automated API tests (`vitest` / supertest).

### Step 3: Build Phase 3 (`apps/web` UI Transformation)
1. Upgrade navigation (`components/Navigation.tsx`) to feature `Guardian Copilot (`/`)`, `Security Dashboard (`/dashboard`)`, `Wallet Audit (`/audit`)`, and `Signing Console (`/signing`)`.
2. Build the interactive `Guardian Chat` component and `/chat` page with rich message cards, risk meters, and quick action chips.
3. Build the upgraded `Security Dashboard` with `Wallet Score (72/100)`, `Exposure ($4,812)`, and `Threat Alerts`.
4. Create the dedicated `90-Second Demo Mode (`/demo`)` with pre-filled, one-click triggers so the presentation is instant, visually impressive, and 100% bug-free.
5. Test end-to-end flow from UI -> ASP API -> Agent Layer -> Core Blockchain/Graph.
