# Phase 2 Architecture

In Phase 2, the architecture evolves from a Read-Only execution layer into a Draft-Simulation-Analyze pipeline. 

```mermaid
graph TD
    A[Claude / ChatGPT] -->|MCP JSON-RPC| B(WETH MCP Server)
    B --> C{Transaction Execution Service}
    C --> D[Viem / Sepolia RPC]
    C --> E[Prisma DB]
    
    B --> F[Policy Engine]
    B --> G[Risk Engine]
    F --> E
    G --> E
```

**Layers Added:**
- Prisma `TransactionDraft`, `PolicyDecision`, `TransactionAudit` models.
- Fastify REST controllers.
- `PolicyEngine` and `RiskEngine` shared classes.
