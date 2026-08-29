# Weth v1.1 — 2-Minute Hackathon Demo Video Script & Production Guide

> **Target Length:** Exactly **1 minute 55 seconds to 2 minutes**  
> **Target Tracks:** **AI x Ethereum** (Primary) & **Infratooling** (Secondary)

---

## 🎬 Pre-Recording Checklist (Before Hit Record)

1. **Open Browser Tabs in Order:**
   - **Tab 1:** Landing Page (`http://localhost:3001`) — Fullscreen video hero
   - **Tab 2:** Claude Desktop / Cursor or AI Agent Terminal
   - **Tab 3:** Weth Signing Console (`http://localhost:3002/signing`)
   - **Tab 4:** Audit History & Portfolio (`http://localhost:3002/history` and `/portfolio`)
2. **Resolution & Audio:**
   - Record in **1080p (1920x1080)** at 60 FPS.
   - Speak clearly, energetically, and with steady pacing.

---

## ⏱️ Second-by-Second Shot List & Voiceover Script

### Act 1: The Hook & Core Philosophy (0:00 – 0:20 | 20 seconds)
* **What to Show on Screen:**
  - Start on **Tab 1 (`http://localhost:3001`)** showing the high-impact Weth landing page with the fullscreen video background and title: *"Autonomous AI Agent Drafting with Zero-Trust Human Execution"*.
  - Scroll smoothly down to the 3 Apple-style code blocks (`#code-showcase`).
* **What to Say (Voiceover):**
  > *"As AI agents evolve from chatbots into autonomous economic agents, integrating them with Web3 creates a massive security dilemma: handing an LLM your private keys is catastrophic, but keeping them isolated makes them useless.*
  > 
  > *Today we present **Weth v1.1**—an institutional-grade zero-trust bridge built specifically for the **AI x Ethereum** track."*

---

### Act 2: Live AI Agent Drafting via Model Context Protocol (0:20 – 0:50 | 30 seconds)
* **What to Show on Screen:**
  - Switch to **Tab 2** (Claude Desktop / terminal window).
  - Show the user prompt: *"Check my Sepolia ETH balance and draft a transfer of 0.015 ETH to vitalik.eth."*
  - Highlight the AI calling Weth's MCP tools: `get_balance`, `simulate_transaction` (showing gas estimation), and `create_transaction_draft`.
* **What to Say (Voiceover):**
  > *"Weth connects AI models directly to Ethereum using Anthropic's **Model Context Protocol (MCP)**.*
  > 
  > *Watch what happens when I ask Claude to transfer 0.015 ETH on Sepolia. Through our local stdio MCP server, Claude inspects my real-time balance and simulates gas costs.*
  > 
  > *Crucially, **the AI never accesses my private key**. Instead, it stages the transaction payload into quarantine with status `PENDING_APPROVAL`."*

---

### Act 3: Human-in-the-Loop Quarantine & Signing (0:50 – 1:30 | 40 seconds)
* **What to Show on Screen:**
  - Switch to **Tab 3 (`http://localhost:3002/signing`)**.
  - Point out the **Pending Draft Card (`#9011`)**, the green **Policy Engine Badge (`SAFE / WITHIN LIMITS`)**, and the clear EIP-712 payload inspection block.
  - Click the purple **Sign & Execute via MetaMask** button and show the MetaMask popup authorizing the transaction.
* **What to Say (Voiceover):**
  > *"Now let's switch to the **Weth Signing Console** running locally in our browser.*
  > 
  > *Here in our Human-in-the-Loop quarantine, every AI-drafted transaction is staged for review. Our deterministic Zod policy engine automatically verifies that spending limits and allowance rules are respected.*
  > 
  > *I can inspect the exact transaction parameters and, with one click, securely sign and broadcast the transaction using my own hardware or browser wallet."*

---

### Act 4: Audit Ledger & Portfolio Intelligence (1:30 – 1:50 | 20 seconds)
* **What to Show on Screen:**
  - Click over to **Tab 4 (`http://localhost:3002/history`)** showing the tamper-proof PostgreSQL audit table.
  - Briefly click **Portfolio (`/portfolio`)** showing the color-coded Concentration Risk gauge and sharp UI cards.
* **What to Say (Voiceover):**
  > *"Every single MCP tool request is permanently logged in a PostgreSQL audit database for compliance.*
  > 
  > *And our built-in Risk Center continuously monitors token concentration and unlimited spender allowances across your entire portfolio."*

---

### Act 5: Strong Final CTA (1:50 – 2:00 | 10 seconds)
* **What to Show on Screen:**
  - Switch back to the **Landing Page Hero (`http://localhost:3001`)** or the **GitHub Repository**.
* **What to Say (Voiceover):**
  > *"**Weth v1.1**: Giving autonomous AI agents the power to draft, while keeping cryptographic execution 100% in human hands.*
  > 
  > *Open-source and ready for the **AI x Ethereum** and **Infratooling** tracks. Thank you for watching!"*

---

## 💡 Quick Tips for a Winning Delivery
- **Keep energy high:** Speak with authority and enthusiasm.
- **Don't wait on slow loading:** If MetaMask or a network request takes a few extra seconds, edit out the dead pause during post-production so your video stays punchy and strictly under 2 minutes.
