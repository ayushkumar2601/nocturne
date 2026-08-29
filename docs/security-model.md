# Security Model

The WETH security model relies on a strict **Human-in-the-Loop (HITL)** architecture.

## Guiding Principles
- **No Private Keys**: The WETH backend, database, and MCP agents NEVER possess private keys, seed phrases, or active signing capabilities.
- **Isolated Roles**: The AI agent acts exclusively as a specialized drafter. 
- **Verifiable Simulation**: Before a human even sees a prompt to sign, the transaction must pass the Policy Engine and Risk Engine evaluations, and a successful on-chain dry-run.

## Risk Engine
Evaluates heuristics like:
- Contract verification status.
- Value magnitude.
- Interaction history.
