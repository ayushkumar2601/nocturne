"use client";

import React, { useState } from "react";
import { guardianChat } from "../../lib/guardian-api";
import { GuardianSecurityReport } from "@weth/agent";
import { SecurityCard } from "./SecurityCard";
import { Send, Terminal, User, Loader2, AlertCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "guardian";
  text: string;
  report?: GuardianSecurityReport;
  intent?: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "guardian",
    text: "WETH GUARDIAN ASP // INTENT ROUTER READY. Enter natural language instructions or paste raw EVM calldata / addresses below.",
  },
];

function generateMsgId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "msg-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
}

export function GuardianChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("ANALYZING...");

  const quickActions = [
    {
      label: "[AUDIT_WALLET]",
      prompt: "Audit my wallet 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      status: "SCANNING WALLET GRAPH...",
    },
    {
      label: "[SIMULATE_CALLDATA]",
      prompt:
        "Analyze transaction from 0x742d35Cc6634C0532925a3b844Bc454e4438f44e to 0x9999999999999999999999999999999999999999 with calldata 0x095ea7b30000000000000000000000009999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      status: "EXECUTING ETH_CALL SIMULATION...",
    },
    {
      label: "[CONTRACT_TRUST]",
      prompt: "Analyze contract trust for 0x00000000000000000000000000000000dead",
      status: "EVALUATING BYTECODE & GRAPH...",
    },
  ];

  async function handleSend(customPrompt?: string, customStatus?: string) {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: generateMsgId(),
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);
    setLoadingText(
      customStatus ||
        (textToSend.toLowerCase().includes("wallet")
          ? "SCANNING WALLET GRAPH..."
          : textToSend.toLowerCase().includes("transaction") || textToSend.includes("0x095ea7b3")
          ? "EXECUTING ETH_CALL SIMULATION..."
          : "EVALUATING BYTECODE & GRAPH...")
    );

    try {
      const response = await guardianChat(textToSend);
      const guardianMsg: ChatMessage = {
        id: generateMsgId(),
        sender: "guardian",
        text: response.assistantMessage || response.report.formattedText || "Execution trace verified.",
        report: response.report,
        intent: response.intent,
      };
      setMessages((prev) => [...prev, guardianMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reach WETH Guardian runtime.";
      const errorMsg: ChatMessage = {
        id: generateMsgId(),
        sender: "guardian",
        text: `[RUNTIME ERROR]: ${msg}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[650px] rounded-xl border border-[#1c1c22] bg-[#0a0a0c] shadow-lg overflow-hidden">
      {/* Monochromatic Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1c1c22] bg-[#101014]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#ffffff] text-[#000000] flex items-center justify-center font-bold">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#ffffff] font-mono tracking-tight uppercase">
                GUARDIAN COPILOT // TERMINAL
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16161b] border border-[#27272a] text-[#10b981] font-semibold">
                [ACTIVE]
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#71717a] font-mono">
          <span>ZERO_KEY_ROUTER</span>
        </div>
      </div>

      {/* Quick Actions Feed */}
      <div className="px-5 py-2.5 bg-[#0a0a0c] border-b border-[#1c1c22] flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-mono font-semibold text-[#52525b] uppercase tracking-wider mr-1 shrink-0">
          HEURISTICS:
        </span>
        {quickActions.map((qa, i) => (
          <button
            key={i}
            onClick={() => handleSend(qa.prompt, qa.status)}
            disabled={loading}
            className="text-[11px] font-mono px-2.5 py-1 rounded border border-[#27272a] bg-[#101014] text-[#a1a1aa] hover:border-[#5e6ad2] hover:text-[#ffffff] transition-all whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center shrink-0 font-mono text-xs ${
                msg.sender === "user"
                  ? "bg-[#27272a] text-[#ffffff]"
                  : "bg-[#ffffff] text-[#000000]"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[88%] flex flex-col gap-3 ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* If there's a structured Security Report, display the SecurityCard */}
              {msg.report && msg.report.riskScore !== undefined ? (
                <div className="w-full space-y-3">
                  <SecurityCard report={msg.report} className="w-full shadow-md" />
                  {msg.text && (
                    <div className="text-xs font-mono text-[#a1a1aa] bg-[#101014] p-3.5 rounded border border-[#1c1c22] whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  )}
                </div>
              ) : msg.text.startsWith("[RUNTIME ERROR]") ? (
                <div className="p-3.5 rounded border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{msg.text}</span>
                </div>
              ) : (
                <div
                  className={`px-4 py-3 rounded text-xs font-mono leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#ffffff] text-[#000000] font-semibold"
                      : "bg-[#101014] text-[#d4d4d8] border border-[#1c1c22]"
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#ffffff] text-[#000000] flex items-center justify-center animate-pulse">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded bg-[#101014] border border-[#1c1c22] text-xs font-mono text-[#a1a1aa]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5e6ad2]" />
              <span>{loadingText}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 border-t border-[#1c1c22] bg-[#101014] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or natural prompt (e.g. Audit my wallet 0x..., or analyze calldata)..."
          disabled={loading}
          className="flex-1 rounded border border-[#27272a] bg-[#0a0a0c] px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#5e6ad2] text-[#ffffff] placeholder:text-[#52525b] disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-9 px-4 rounded bg-[#ffffff] text-[#000000] font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#e4e4e7] disabled:opacity-40 transition-colors cursor-pointer shrink-0 uppercase"
        >
          <span>EXECUTE</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
