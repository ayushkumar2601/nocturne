'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  LockKeyhole,
  Fingerprint,
  ArrowRightCircle,
  Menu,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Terminal as TerminalIcon,
  Code2,
  FileJson,
  Play,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terminal' | 'mcp' | 'agent'>('terminal');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVideoModalOpen(false);
      }
    };
    if (videoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoModalOpen]);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(key);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const navLinks = [
    { label: 'Console', href: 'http://localhost:3002/signing' },
    { label: 'Architecture', href: '#features' },
    { label: 'Interactive Code', href: '#code-showcase' },
    { label: 'Setup Guide', href: '#download' },
    { label: 'GitHub', href: 'https://github.com/ayushkumar2601/weth_wallet_devcon' },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  const terminalCloneCode = `# 1. Clone the Weth zero-trust repository
git clone https://github.com/ayushkumar2601/weth_wallet_devcon.git
cd weth_wallet_devcon

# 2. Install workspace monorepo dependencies
pnpm install

# 3. Launch local Weth Signing Console & Core Backend
pnpm dev`;

  const mcpJsonCode = `{
  "mcpServers": {
    "weth-wallet": {
      "command": "node",
      "args": [
        "/absolute/path/to/weth_wallet_devcon/apps/mcp-server/dist/index.js"
      ],
      "env": {
        "DATABASE_URL": "postgresql://weth:weth_pass@localhost:5432/weth_db?schema=public"
      }
    }
  }
}`;

  const agentSessionCode = `> Prompting Claude: "Check my Sepolia ETH balance and draft a 0.015 ETH transfer to vitalik.eth"

[MCP Client] Executing tool: get_balance({ address: "0x71C...E39a" })
[Weth Core]  Returned: { balance: "1.4820 ETH", status: "SAFE" }

[MCP Client] Executing tool: simulate_transaction({ to: "vitalik.eth", value: "0.015 ETH" })
[Weth Core]  Simulation SUCCESS. Gas Estimated: 21,000 | Fee: 0.00014 ETH

[MCP Client] Executing tool: create_transaction_draft(...)
[Weth Core]  STAGED DRAFT #9011 -> STATUS: PENDING_APPROVAL (Quarantine Active)
[Action]     Open http://localhost:3002/signing to inspect payload and sign with MetaMask.`;

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-[#192837]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* FULLSCREEN HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Video — 100% UNMODIFIED, NO FADE/TRANSPARENCY OVERLAYS */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
        />

        {/* NAVBAR */}
        <header className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          {/* Logo + Brand */}
          <a href="#" className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              overflow="visible"
              viewBox="0 0 256 256"
            >
              <path
                d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z"
                fill="#192837"
              />
            </svg>
            <span
              className="text-2xl font-bold tracking-tight text-[#192837]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Weth
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#192837] opacity-75 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="http://localhost:3002/signing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:brightness-110 shadow-sm"
              style={{ background: '#7342E2' }}
            >
              Start For Free
            </a>
            <a
              href="http://localhost:3002/signing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-sm font-medium text-[#192837] transition-colors hover:bg-neutral-300"
              style={{ background: '#F2F2EE' }}
            >
              Sign In
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#192837] focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* HERO CONTENT CONTAINER */}
        <div
          className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-8 flex-1 flex flex-col justify-center"
          style={{ paddingTop: 'clamp(40px, 8vw, 72px)', paddingBottom: '60px' }}
        >
          <div className="max-w-[560px]">
            {/* HERO HEADING tailored for Weth */}
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[#192837]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.65rem, 5vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                marginBottom: '24px',
              }}
            >
              <span className="inline-flex items-center align-middle relative -top-[2px] mr-1.5">
                <Zap className="w-6 h-6 text-[#192837]" />
              </span>
              Autonomous AI Agent Drafting{' '}
              <span className="inline-flex items-center align-middle relative -top-[2px] mx-1">
                <LockKeyhole className="w-6 h-6 text-[#192837]" />
              </span>
              with Zero-Trust Human Execution
              <span className="inline-flex items-center align-middle relative -top-[2px] ml-1.5">
                <Fingerprint className="w-6 h-6 text-[#192837]" />
              </span>
            </motion.h1>

            {/* HERO SUBTEXT tailored for Weth */}
            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[#192837]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: 1.65,
                opacity: 0.8,
                maxWidth: '560px',
                marginBottom: '36px',
              }}
            >
              The institutional-grade bridge between Large Language Models and Ethereum. Let AI assistants inspect balances, simulate gas, and draft transactions via MCP—while every single on-chain action stays locked behind your explicit cryptographic signature.
            </motion.p>

            {/* CTA BUTTON */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
              <motion.button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-between font-semibold text-white transition-all cursor-pointer"
                style={{
                  background: '#7342E2',
                  borderRadius: '50px',
                  padding: '17px 24px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  boxShadow: '0 4px 24px rgba(115, 66, 226, 0.28)',
                  minWidth: '210px',
                  gap: '32px',
                }}
              >
                <span>Watch Video Demo</span>
                <Play className="w-5 h-5 shrink-0 fill-current" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Subtle Bottom Accent Line */}
        <div className="relative z-10 w-full h-1 bg-gradient-to-r from-[#7342E2] via-[#192837] to-transparent" />
      </section>

      {/* MOBILE MENU SHEET */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(25, 40, 55, 0.35)', backdropFilter: 'blur(4px)' }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="fixed right-0 top-0 z-50 flex flex-col justify-between p-6"
              style={{
                width: 'min(88vw, 360px)',
                height: '100dvh',
                background: '#CFC8C5',
                boxShadow: '-12px 0 48px rgba(25, 40, 55, 0.18)',
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-xl font-bold text-[#192837]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Weth
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#192837]"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="w-full h-px bg-[#192837]/15 my-3" />
                <nav className="flex flex-col gap-5 pt-4">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + idx * 0.07, duration: 0.35 }}
                      className="text-lg font-medium text-[#192837]"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-[#192837]/15">
                <a
                  href="http://localhost:3002/signing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-center rounded-full text-sm font-medium text-white shadow-md"
                  style={{ background: '#7342E2' }}
                >
                  Start For Free
                </a>
                <a
                  href="http://localhost:3002/signing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-center rounded-full text-sm font-medium text-[#192837]"
                  style={{ background: '#F2F2EE' }}
                >
                  Sign In
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* APPLE-STYLE / $10,000 STACKED INTERACTIVE SHOWCASE SECTIONS */}
      <div id="code-showcase" className="bg-[#F8F9FA] border-b border-neutral-200 divide-y divide-neutral-200/80">
        {/* SECTION 1: CODE LEFT (7 cols), TEXT RIGHT (5 cols) — TERMINAL SETUP */}
        <section className="py-24 sm:py-32 max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Apple macOS Terminal Window */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#0D1117] border border-neutral-800 shadow-[0_32px_80px_rgba(0,0,0,0.30)]">
              {/* Window Titlebar */}
              <div className="px-5 py-4 bg-[#161B22] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#7342E2]" />
                  <span>Terminal &mdash; zsh</span>
                </div>
                <button
                  onClick={() => copyText('terminal', terminalCloneCode)}
                  className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-neutral-700 text-xs font-mono text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedStep === 'terminal' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Window Code Content */}
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-neutral-200 space-y-3">
                <div>
                  <span className="text-neutral-500"># 1. Clone the Weth zero-trust repository</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">$ </span>
                  <span className="text-white">git clone </span>
                  <span className="text-cyan-400">https://github.com/ayushkumar2601/weth_wallet_devcon.git</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">$ </span>
                  <span className="text-white">cd weth_wallet_devcon</span>
                </div>
                <div className="pt-2">
                  <span className="text-neutral-500"># 2. Install workspace monorepo dependencies</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">$ </span>
                  <span className="text-white">pnpm install</span>
                </div>
                <div className="pt-2">
                  <span className="text-neutral-500"># 3. Launch local Weth Signing Console &amp; Core Backend</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">$ </span>
                  <span className="text-white">pnpm dev</span>
                </div>
                <div className="pt-3 border-t border-neutral-800/80 text-emerald-400 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Weth Signing Console live at http://localhost:3002</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Copy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7342E2]/10 text-[#7342E2] text-xs font-bold tracking-wide uppercase">
                01 / DEPLOYMENT
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#192837] tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Instant Monorepo Deployment.
              </h2>
              <p className="text-sm sm:text-base text-[#192837]/75 leading-relaxed">
                Engineered as a high-performance Turborepo workspace. One single terminal command installs all dependencies and concurrently boots the zero-trust desktop signing console, API gateway, and local MCP server.
              </p>
              <ul className="space-y-3 text-sm font-medium text-[#192837]/85 pt-2">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Zero-config Turborepo monorepo structure
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Dedicated Next.js Signing Console on port 3002
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Built-in Ethereum Sepolia testnet readiness
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: TEXT LEFT (5 cols), CODE RIGHT (7 cols) — CLAUDE DESKTOP / CURSOR MCP */}
        <section className="py-24 sm:py-32 max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7342E2]/10 text-[#7342E2] text-xs font-bold tracking-wide uppercase">
                02 / MCP INTEGRATION
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#192837] tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Native Model Context Protocol.
              </h2>
              <p className="text-sm sm:text-base text-[#192837]/75 leading-relaxed">
                Connect Weth directly to Claude Desktop or Cursor in seconds. Give your Large Language Model assistants deterministic, read-only tools to inspect balances and stage transactions over standard stdio pipes.
              </p>
              <ul className="space-y-3 text-sm font-medium text-[#192837]/85 pt-2">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Standard stdio JSON-RPC transport specification
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Isolated ERC-20 read &amp; gas simulation tools
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Strict runtime input validation powered by Zod
                </li>
              </ul>
            </div>

            {/* Right Column: Apple macOS JSON Editor Window */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#0D1117] border border-neutral-800 shadow-[0_32px_80px_rgba(0,0,0,0.30)] order-1 lg:order-2">
              {/* Window Titlebar */}
              <div className="px-5 py-4 bg-[#161B22] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <FileJson className="w-3.5 h-3.5 text-[#7342E2]" />
                  <span>claude_desktop_config.json</span>
                </div>
                <button
                  onClick={() => copyText('mcp', mcpJsonCode)}
                  className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-neutral-700 text-xs font-mono text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedStep === 'mcp' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Window Code Content */}
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-neutral-300">
                <pre>
                  <code>{mcpJsonCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CODE LEFT (7 cols), TEXT RIGHT (5 cols) — ZERO-TRUST AGENT QUARANTINE */}
        <section className="py-24 sm:py-32 max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Apple macOS Agent Execution Window */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#0D1117] border border-neutral-800 shadow-[0_32px_80px_rgba(0,0,0,0.30)]">
              {/* Window Titlebar */}
              <div className="px-5 py-4 bg-[#161B22] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Agent Session &mdash; Execution Log</span>
                </div>
                <button
                  onClick={() => copyText('agent', agentSessionCode)}
                  className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-neutral-700 text-xs font-mono text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedStep === 'agent' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Window Code Content */}
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-neutral-200 space-y-3">
                <div className="text-neutral-400">
                  <span className="text-purple-400 font-bold">&gt;</span> Prompting Claude: &ldquo;Check my Sepolia ETH balance and draft a 0.015 ETH transfer to vitalik.eth&rdquo;
                </div>
                <div className="text-cyan-300">
                  [MCP Client] <span className="text-white">Executing tool:</span> get_balance(&#123; address: &quot;0x71C...E39a&quot; &#125;)
                </div>
                <div className="text-emerald-400">
                  [Weth Core]  Returned: &#123; balance: &quot;1.4820 ETH&quot;, status: &quot;SAFE&quot; &#125;
                </div>
                <div className="pt-2 text-cyan-300">
                  [MCP Client] <span className="text-white">Executing tool:</span> simulate_transaction(&#123; to: &quot;vitalik.eth&quot;, value: &quot;0.015 ETH&quot; &#125;)
                </div>
                <div className="text-emerald-400">
                  [Weth Core]  Simulation SUCCESS. Gas Estimated: 21,000 | Fee: 0.00014 ETH
                </div>
                <div className="pt-2 text-cyan-300">
                  [MCP Client] <span className="text-white">Executing tool:</span> create_transaction_draft(...)
                </div>
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 font-semibold">
                  [Weth Core] STAGED DRAFT #9011 &rarr; STATUS: PENDING_APPROVAL (Quarantine Active)
                  <div className="text-xs font-normal text-purple-300/80 mt-1">
                    Action Required: Open http://localhost:3002/signing to inspect payload and sign with MetaMask.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Copy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7342E2]/10 text-[#7342E2] text-xs font-bold tracking-wide uppercase">
                03 / ZERO-TRUST SECURITY
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#192837] tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                AI Drafts. Only You Sign.
              </h2>
              <p className="text-sm sm:text-base text-[#192837]/75 leading-relaxed">
                AI agents can reason, simulate gas, and prepare payload parameters—but can never sign or broadcast. Every staged draft waits in local quarantine until you explicitly authorize it with your wallet extension.
              </p>
              <ul className="space-y-3 text-sm font-medium text-[#192837]/85 pt-2">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Private keys never exposed to AI models
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Human-in-the-loop payload inspection &amp; risk flags
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Tamper-proof PostgreSQL transaction audit trail
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* CORE ARCHITECTURE SECTION */}
      <section id="features" className="py-24 max-w-[1280px] mx-auto px-5 sm:px-8 border-b border-neutral-200">
        <div className="space-y-3 mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7342E2]">
            SECURITY PARADIGM
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#192837]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Zero-Trust Human-in-the-Loop?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              title: 'Model Context Protocol (MCP)',
              desc: 'AI agents inspect wallet balances and draft transactions in a zero-trust sandbox without ever accessing your private keys.',
            },
            {
              icon: ShieldCheck,
              title: 'Human-in-the-Loop Quarantine',
              desc: 'Every staged draft waits in pending status until reviewed and explicitly signed by your cryptographic wallet extension.',
            },
            {
              icon: TerminalIcon,
              title: 'Automated Risk & Policy Guardrails',
              desc: 'Real-time policy engines enforce spending limits and alert you to unlimited spender allowances before signing.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-neutral-200/80 bg-[#F2F2EE]/40 hover:bg-[#F2F2EE] transition-all space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#192837] text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-bold text-[#192837]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#192837]/75 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TASTEFUL FOOTER */}
      <footer className="w-full py-10 border-t border-neutral-200 bg-[#F2F2EE]/50">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#192837]/70">
          <div>
            Designed and Developed by <span className="font-bold text-[#192837]">Ayush</span> with ❤️
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ayushkumar2601/weth_wallet_devcon"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#192837] font-medium transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="http://localhost:3002/signing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#192837] font-medium transition-colors"
            >
              Signing Console
            </a>
          </div>
        </div>
      </footer>

      {/* VIDEO DEMO MODAL */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden shadow-2xl rounded-2xl border border-white/15 bg-[#192837]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#192837]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#7342E2]" />
                  <span className="text-sm font-semibold text-white tracking-wide">
                    Weth Video Demonstration
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close video demo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Container */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                <iframe
                  src="https://www.youtube.com/embed/jO91JiECPEw?autoplay=1&rel=0"
                  title="Weth Video Demonstration"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
