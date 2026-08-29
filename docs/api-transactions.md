# Transaction REST API

## POST `/transactions/draft`
Body: `{ from, to, value, data }`
Returns: Draft ID and gas estimates.

## POST `/transactions/simulate`
Body: `{ from, to, value, data }`
Returns: Viem dry-run result.

## POST `/transactions/analyze`
Body: `{ draftId }`
Returns: Policy, Risk, and Simulation evaluations. State changes to SIMULATED or REJECTED.

## POST `/transactions/approve`
Body: `{ draftId }`
Returns: Changes state to APPROVED.

## POST `/transactions/broadcast`
Body: `{ signedTransaction }`
Returns: Tx Hash.

## GET `/transactions/:id/audit`
Returns: All MCP/API interactions related to the draft.
