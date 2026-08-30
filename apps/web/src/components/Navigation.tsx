"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Terminal, Activity } from "lucide-react";
import { ConnectMidnightWallet } from "./ConnectMidnightWallet";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Copilot Chat" },
    { href: "/dashboard", label: "Security Dashboard" },
    { href: "/audit", label: "Wallet Scanner" },
    { href: "/transactions", label: "EVM Simulator" },
    { href: "/signing", label: "Signing Console" },
    { href: "/deploy", label: "Midnight Deployer" },
  ];

  return (
    <header className="w-full border-b border-[#18181b] bg-[#000000]/90 transition-colors sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Left: Logo + Terminal Tag + Navigation Links */}
        <div className="flex items-center gap-8 min-w-0 overflow-x-auto">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-7 h-7 rounded border border-[#27272a] flex items-center justify-center bg-[#09090b] text-[#ffffff] transition-all group-hover:border-[#5e6ad2]">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[#ffffff] font-mono">
                WETH // GUARDIAN
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#27272a] bg-[#09090b] text-[#a1a1aa] uppercase tracking-wider">
                ASP v2.0
              </span>
            </div>
          </Link>

          {/* Monochromatic Navigation Links */}
          <nav className="flex items-center gap-6 shrink-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-[#ffffff] border-b border-[#ffffff]"
                      : "border-b border-transparent text-[#71717a] hover:text-[#d4d4d8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Terminal Health Status + Connect Wallet */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#a1a1aa]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10b981]" />
            </span>
            <span className="tracking-tight uppercase">SYS_HEALTH: 100% OPTIMAL</span>
          </div>

          <div className="scale-90 origin-right flex items-center gap-2">
            <ConnectMidnightWallet />
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
