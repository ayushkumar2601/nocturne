# WETH Demo Script (Hackathon)

## 0:00 - Setup
"Welcome to WETH. We are bringing AI-driven, human-in-the-loop transaction intelligence to Ethereum."
*(Show the Next.js Dashboard. Connect MetaMask wallet on Sepolia.)*

## 1:00 - Portfolio Intelligence
"Right now, my wallet has an overview of its risk profile calculated automatically."
*(Click on Risk Center. Point out how the Approval Analyzer scanned the blockchain and confirmed no infinite approvals to suspicious contracts exist.)*

## 2:00 - The AI Agent
*(Open Claude Desktop side-by-side with the Dashboard)*
**Prompt:** "Please check my WETH portfolio and draft a transaction to send 0.0001 ETH to myself."

*(Watch Claude use the `get_wallet_summary` tool, then the `create_transaction_draft` tool.)*
"Claude has successfully drafted the transaction. It autonomously queried the Sepolia network to estimate gas."

## 3:00 - Risk Analysis & Simulation
**Prompt:** "Please analyze the risk of this draft."
*(Watch Claude use the `analyze_transaction_risk` tool)*
"WETH's backend Risk Engine runs a real-time dry-run simulation on Sepolia. The Policy Engine sees the value is under 10 ETH, so it flags it as SAFE."

**Prompt:** "I approve this transaction."
*(Watch Claude use `approve_transaction` tool)*

## 4:00 - Execution & Security
"The transaction is now APPROVED in the database. But remember, WETH is non-custodial. Claude does not have our private keys."
*(Turn to the Web Dashboard. A blue 'Action Required: Pending Approvals' banner appears instantly)*

"The frontend sees the approved draft. I click 'Sign & Broadcast', MetaMask pops up, I sign the payload, and it executes!"

## 5:00 - Audit Logs
"Finally, we can go to the Audit Logs page. Every single tool Claude invoked, the exact JSON payloads, and the Risk scores are immutably logged for compliance."
