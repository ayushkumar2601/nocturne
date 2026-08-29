# Transaction Layer

The Transaction Layer is introduced in Phase 2 to enable safe, simulation-backed transaction drafting on the Sepolia network. 

## Flow
1. **Draft**: Create a draft in the PostgreSQL database.
2. **Estimate Gas**: Viem evaluates the execution cost.
3. **Simulate**: Viem performs a dry-run against the RPC.
4. **Analyze**: The Risk and Policy engines score the draft.
5. **Approve**: A human explicitly approves the transaction payload.
6. **Broadcast**: The signed payload is broadcast to the network.

All states are heavily audited via the `TransactionAudit` table.
