# MCP Tools

The `mcp-server` app exposes the following tools to AI agents:

1. `get_balance`: Takes `address`, returns ETH balance.
2. `get_token_balances`: Takes `address`, returns ERC20 tokens.
3. `get_transactions`: Takes `address`, returns recent txs.
4. `get_wallet_summary`: Takes `address`, returns combined summary.
5. `resolve_ens`: Takes `name`, returns resolved address.


## Claude Desktop Configuration

Add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "weth": {
      "command": "node",
      "args": [
        "/absolute/path/to/weth/apps/mcp-server/dist/index.js"
      ]
    }
  }
}
```
