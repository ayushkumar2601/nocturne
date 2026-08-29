# API Reference

## GET `/health`
Returns `{ status: 'ok' }` if database and Redis are reachable.

## GET `/wallet/:address`
Validates address and returns it.

## GET `/wallet/:address/balance`
Returns the ETH balance on Sepolia.

## GET `/wallet/:address/tokens`
Returns ERC20 token balances (stubbed).

## GET `/wallet/:address/transactions`
Returns recent transactions (stubbed).

## GET `/wallet/:address/summary`
Returns a summary payload.

## GET `/ens/:name`
Resolves an ENS name to an address.
