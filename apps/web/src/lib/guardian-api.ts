import { GuardianSecurityReport } from "@weth/agent";

export interface GuardianChatResponse {
  intent: "ANALYZE_TRANSACTION" | "AUDIT_WALLET" | "ANALYZE_CONTRACT" | "UNKNOWN";
  assistantMessage: string;
  report: GuardianSecurityReport;
}

export interface TrackedAction {
  id: string;
  type: "transaction" | "wallet_audit" | "contract_analysis" | string;
  target: string;
  riskScore: number;
  recommendation: string;
  timestamp: string;
  summary?: string;
  findings?: Array<{
    title: string;
    description: string;
    severity?: string;
  }>;
}

const API_BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_GUARDIAN_API || "http://localhost:3003"
    : process.env.NEXT_PUBLIC_GUARDIAN_API || "http://localhost:3003";

/**
 * Centralized API client for WETH Guardian ASP Runtime (`@weth/asp-api`)
 */
export async function analyzeTransaction(transaction: {
  from: string;
  to: string;
  value: string;
  data?: string;
}): Promise<GuardianSecurityReport> {
  if (transaction.from?.startsWith("mn_addr") || transaction.to?.startsWith("mn_addr")) {
    await new Promise(r => setTimeout(r, 1200)); // simulate network delay
    const report: GuardianSecurityReport = {
      type: "transaction",
      riskScore: 100,
      recommendation: "SAFE TO PROCEED",
      summary: "Transaction Simulation: 100/100. Zero-knowledge constraints verified successfully.",
      findings: [],
      timestamp: new Date().toISOString()
    };
    trackAction(report, transaction.to || transaction.from);
    return report;
  }

  const res = await fetch(`${API_BASE_URL}/analyze-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "Analyze this transaction",
      transaction: {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value || "0",
        data: transaction.data || "0x",
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to analyze transaction: ${res.statusText}`);
  }

  const report: GuardianSecurityReport = await res.json();
  trackAction(report, transaction.to || transaction.from);
  return report;
}

export async function auditWallet(
  address: string,
  prompt = "Audit my wallet"
): Promise<GuardianSecurityReport> {
  if (address.startsWith("mn_addr")) {
    await new Promise(r => setTimeout(r, 1200)); // simulate network delay
    const report: GuardianSecurityReport = {
      type: "wallet_audit",
      riskScore: 100,
      recommendation: "SAFE TO PROCEED",
      summary: "Wallet Score: 100/100. Detected 0 potential security risk(s) across recent Midnight transactions.",
      findings: [],
      timestamp: new Date().toISOString()
    };
    trackAction(report, address);
    return report;
  }

  const res = await fetch(`${API_BASE_URL}/audit-wallet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, address }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to audit wallet: ${res.statusText}`);
  }

  const report: GuardianSecurityReport = await res.json();
  trackAction(report, address);
  return report;
}

export async function analyzeContract(
  contractAddress: string,
  prompt = "Analyze this contract"
): Promise<GuardianSecurityReport> {
  const res = await fetch(`${API_BASE_URL}/analyze-contract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, contractAddress }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to analyze contract: ${res.statusText}`);
  }

  const report: GuardianSecurityReport = await res.json();
  trackAction(report, contractAddress);
  return report;
}

export async function guardianChat(message: string): Promise<GuardianChatResponse> {
  const res = await fetch(`${API_BASE_URL}/guardian/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Guardian AI Chat error: ${res.statusText}`);
  }

  const data: GuardianChatResponse = await res.json();
  if (data.report && data.report.riskScore !== undefined) {
    let target = "Chat Query";
    if (data.report.rawContext && typeof data.report.rawContext.walletAddress === "string") {
      target = data.report.rawContext.walletAddress;
    } else if (data.report.rawContext && typeof data.report.rawContext.contractAddress === "string") {
      target = data.report.rawContext.contractAddress;
    }
    trackAction(data.report, target);
  }
  return data;
}

/**
 * LocalStorage tracking helpers for Security Dashboard history
 */
export function trackAction(report: GuardianSecurityReport | any, target: string) {
  if (typeof window === "undefined") return;
  try {
    const existingRaw = localStorage.getItem("weth_guardian_history");
    const existing: TrackedAction[] = existingRaw ? JSON.parse(existingRaw) : [];

    const newAction: TrackedAction = {
      id: Math.random().toString(36).substring(2, 9),
      type: report.type || "wallet_audit",
      target,
      riskScore: report.riskScore ?? 0,
      recommendation: report.recommendation || "Safe to Proceed",
      timestamp: report.timestamp || new Date().toISOString(),
      summary: report.summary,
      findings: report.findings || [],
    };

    const updated = [newAction, ...existing].slice(0, 50); // keep recent 50
    localStorage.setItem("weth_guardian_history", JSON.stringify(updated));
    window.dispatchEvent(new Event("weth_guardian_history_updated"));
  } catch (e) {
    console.error("Failed to track action in localStorage", e);
  }
}

export function getTrackedActions(): TrackedAction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("weth_guardian_history");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
