# Policy Engine

The Policy Engine serves as the ultimate automated firewall before human approval is requested.

## Current Rules
- **Max Transaction Value**: Hardcoded to 10 ETH. Anything above requires extreme override.
- **Blocked Addresses**: Blacklist of known burn or malicious addresses.
- **New Addresses / Unknown Contracts**: Flagged as `REQUIRES_APPROVAL`.

## Decisions
- `SAFE`: Automated heuristics passed.
- `REQUIRES_APPROVAL`: Flagged for review.
- `BLOCKED`: Instantly rejected, cannot be signed.
