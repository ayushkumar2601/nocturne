# Weth v1.1 — Zero-Trust AI Agent Wallet & Human-in-the-Loop Signing Console

> **The secure bridge between Autonomous AI Agents and On-Chain Ethereum Execution.**

---

## 1. The Vision & Core Idea

As AI agents (powered by Large Language Models and tool-calling protocols) become increasingly capable, developers and users want them to interact with web3 protocols—checking balances, analyzing smart contracts, optimizing portfolios, and preparing transactions.

However, **giving an autonomous AI agent direct access to private keys is a catastrophic security risk.** Hallucinations, prompt injection attacks, or logical bugs can drain a wallet in milliseconds.

### The Solution: Weth v1.1
**Weth** solves this by separating **intent drafting** from **cryptographic signing**:
1. **AI Agents Draft (via MCP):** Using the **Model Context Protocol (MCP)**, AI assistants (such as Claude Desktop, Cursor, or custom AI agents) can inspect wallet balances, query token allowances, analyze risk, and **draft** transactions.
2. **Humans Sign (via Zero-Trust Console):** Every draft transaction enters a secure pending queue. Nothing touches the blockchain until a human opens the minimalist **Weth Signing Console**, inspects the simulated gas and payload, and explicitly clicks **Approve & Sign** with their hardware or browser wallet (MetaMask, Rabby, etc.).

---

## 2. Key Highlights & Architecture

```
+-------------------------------------------------------------------------+
|                         AI AGENT LAYER (MCP)                            |
|   Claude Desktop / Cursor / Custom Agent                                |
|   Tools: get_balance, get_token_balances, draft_transaction             |
+------------------------------------+-+----------------------------------+
                                     | |
               1. Query State &      | | 2. Submit Transaction Draft
               Simulate Gas          | |    (Status: PENDING_SIGNATURE)
                                     v |
+-------------------------------------------------------------------------+
|                       WETH CORE BACKEND & INDEXER                       |
|   Fastify REST API + Prisma Postgres Database + Zero-Trust Policy Engine|
+------------------------------------+------------------------------------+
                                     |
                                     | 3. Live Polling / Notification
                                     v
+-------------------------------------------------------------------------+
|                  WETH SIGNING CONSOLE (FRONTEND UI)                     |
|   Minimalist Monochrome Web Wallet (http://localhost:3002)              |
|   Human reviews payload, executes cryptographic sign & broadcasts       |
+-------------------------------------------------------------------------+
```

### Core Modules
- **`apps/mcp-server`**: Standard **Model Context Protocol** server exposing blockchain inspection and transaction drafting tools to LLMs.
- **`apps/api`**: Fastify REST API backend managing transaction queues, risk scoring, audit trails, and ENS/token resolution.
- **`apps/web`**: Handcrafted, monochrome Next.js frontend featuring dark/light modes, live pending transaction queues, portfolio indexer, and one-click cryptographic signing.
- **`packages/shared` & `packages/blockchain`**: Ethers/Viem blockchain service layer and zero-trust spending policy enforcement engine.

---

## 3. How to Setup & Use Weth (For Users & Developers)

### Prerequisites
- **Node.js** v20+ and **pnpm** v9+
- **PostgreSQL** database (running locally or via Docker)
- An Ethereum wallet extension (MetaMask / Rabby / Rainbow)

---

### Step 1: Clone & Install
```bash
git clone https://github.com/ayushkumar2601/weth_wallet_devcon.git
cd weth_wallet_devcon
pnpm install
```

---

### Step 2: Configure Environment & Database
1. Copy environmental variables:
   ```bash
   cp .env.example .env
   ```
2. Run Prisma database migrations to create tables for pending drafts and audit trails:
   ```bash
   pnpm --filter @weth/database db:push
   ```

---

### Step 3: Start the Local Stack
Launch all services concurrently from the root directory:
```bash
pnpm dev
```
This boots up:
- **Fastify Core API Server**: `http://localhost:3000`
- **Weth Web Signing Console**: `http://localhost:3002`
- **MCP Server stdio / HTTP bridge**

---

### Step 4: Configure the MCP Server in Claude Desktop or Cursor

Add the Weth MCP server to your `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "weth-wallet": {
      "command": "node",
      "args": [
        "/absolute/path/to/weth_wallet_devcon/apps/mcp-server/dist/index.js"
      ],
      "env": {
        "DATABASE_URL": "postgresql://weth:weth_pass@localhost:5432/weth_db?schema=public"
      }
    }
  }
}
```

Restart Claude Desktop. You will now see the `weth-wallet` tools active!

---

## 4. Real-World End-to-End Workflow Example

### 1. Ask Your AI Agent
In your Claude chat or AI editor:
> *"Check my Sepolia ETH balance for `0x71C...E39a`, verify if it's safe, and draft a transaction sending `0.015 ETH` to `0x4B20...91A8`."*

### 2. AI Agent Executes Tools
The AI agent calls:
- `get_balance` &rarr; returns current ETH balance.
- `draft_transaction` &rarr; creates a secure database entry with status `PENDING_APPROVAL`.

### 3. Human Signs on the Weth Console
1. Open **[http://localhost:3002/signing](http://localhost:3002/signing)**.
2. You will see the live **Human-in-the-Loop Signing Queue**.
3. Inspect the destination address, simulated gas, and risk score.
4. Click **Approve & Sign** &rarr; your browser wallet prompts for a signature &rarr; the transaction is broadcast to Ethereum.

---

## 5. Teaser Website Copy / Public Landing Page Blocks

Below are ready-to-use copywriting blocks for your landing page or teaser website:

### Hero Headline
**AI Agents Can Think. Only You Can Sign.**

### Subtitle
Weth v1.1 bridges autonomous AI assistants with Ethereum. Give AI the power to analyze, prepare, and draft transactions—without ever exposing your private keys.

### 3 Key Pillars
1. **Zero-Trust MCP Integration**
   Connect LLMs via the Model Context Protocol. AI agents inspect state and stage transactions safely inside an isolated environment.
2. **Human-in-the-Loop Firewall**
   Every single AI draft is held in quarantine until explicitly authorized by your cryptographic signature.
3. **Engineered Minimalism**
   A stunning monochrome interface built for precision, speed, and uncompromising visual clarity.

---

## 6. Frequently Asked Questions (FAQ)

- **Does the AI agent ever see my private key?**
  No. The MCP server only has read access to public blockchain data and write access to a local pending draft queue. Private keys remain strictly inside your hardware or browser wallet.
- **Which networks are supported?**
  Weth v1.1 currently supports **Sepolia Testnet** and **Ethereum Mainnet**, with modular support for EVM L2s (Arbitrum, Optimism, Base).
- **Can I set spending policies?**
  Yes. The policy engine flags high-risk contracts or unusual transfer amounts before you sign.
