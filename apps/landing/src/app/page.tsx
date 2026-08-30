import React from 'react';
import { ArrowRight } from 'lucide-react';

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
  </svg>
);

export default function Home() {
  return (
    <div className="flex flex-col bg-[#F5F5F5] min-h-screen">
      {/* 1. Navbar + 2. Hero */}
      <div className="h-screen flex flex-col overflow-hidden relative">
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
          <div className="flex items-center justify-between max-w-[88rem] mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 text-black">
                <LogoIcon />
              </div>
              <span className="text-2xl font-medium tracking-tight text-black">Nocturne</span>
            </div>
            
            <div className="hidden md:flex gap-8">
              {['Network', 'Ecosystem', 'Rewards', 'Help', 'News'].map(link => (
                <a key={link} href="#" className="text-base text-gray-700 hover:text-black font-medium transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>

            <button className="bg-black text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200">
              Open Wallet
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex-1 px-6 pt-20 pb-6 flex items-end">
          <div className="relative w-full rounded-2xl overflow-hidden max-w-[88rem] mx-auto" style={{ height: 'calc(100vh - 96px)' }}>
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="object-cover absolute inset-0 w-full h-full"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"
            />
            
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-12 pt-36">
              <h1 className="text-black text-5xl md:text-6xl font-medium leading-tight max-w-xl mb-4" style={{ letterSpacing: '-0.04em' }}>
                Your Wealth<br/>Works
              </h1>
              
              <p className="text-black/70 text-base md:text-lg max-w-md mb-8 leading-relaxed" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
                An automated, reward-powered digital currency built for the <strong className="font-semibold text-black/90">Midnight and Ethereum</strong> ecosystems, enabling native passive earnings and effortless connection into DeFi.
              </p>
              
              <button className="inline-flex items-center gap-3 bg-black text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
                Join us
                <span className="bg-white rounded-full p-2">
                  <ArrowRight className="w-5 h-5 text-black" />
                </span>
              </button>


            </div>
          </div>
        </section>
      </div>

      {/* 3. Info Section */}
      <section className="bg-[#F5F5F5] px-6 py-24">
        <div className="max-w-[88rem] mx-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
            <div>
              <h2 className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8" style={{ letterSpacing: '-0.03em' }}>
                Meet Nocturne.
              </h2>
              <button className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
                Discover it
                <span className="bg-white rounded-full p-2">
                  <ArrowRight className="w-5 h-5 text-black" />
                </span>
              </button>
            </div>
            <div>
              <p className="text-black/70 text-2xl md:text-3xl leading-relaxed">
                Nocturne is a reward-earning digital currency that lets your savings grow securely.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between"
              style={{
                backgroundImage: "url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <h3 className="text-black text-2xl font-medium leading-snug" style={{ letterSpacing: '-0.02em' }}>
                Savings that bloom
              </h3>
              <p className="text-black/70 text-base max-w-xs">
                Gain steady returns as your tokens are routed into top-performing DeFi strategies.
              </p>
            </div>

            <div className="bg-[#2B2644] rounded-2xl p-7 min-h-80 flex flex-col justify-between">
              <h3 className="text-white text-2xl font-medium">
                Always fluid,<br/>always accessible.
              </h3>
              <p className="text-white/60 text-base">
                Keep fully anchored with on-demand access to funds — no lockups or waits.
              </p>
            </div>

            <div className="bg-[#2B2644] rounded-2xl p-7 min-h-80 flex flex-col justify-between">
              <h3 className="text-white text-2xl font-medium">
                Fully<br/>automated
              </h3>
              <p className="text-white/60 text-base">
                Skip the task of tuning positions yourself. Nocturne runs in the background for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Midnight Powered Section */}
      <section className="bg-[#F5F5F5] px-6 py-12 border-y border-black/5 my-12">
        <div className="max-w-[88rem] mx-auto flex flex-col items-center text-center">
          <p className="text-black/50 text-sm font-bold tracking-[0.2em] uppercase mb-4">
            Built on Midnight Network
          </p>
          <h2 className="text-2xl md:text-3xl font-medium leading-tight text-black/80 max-w-3xl" style={{ letterSpacing: '-0.02em' }}>
            Harnessing zero-knowledge technology to protect your financial privacy while ensuring seamless compliance and trust.
          </h2>
        </div>
      </section>

      {/* 5. Use Cases & MCP Section */}
      <section className="bg-[#F5F5F5] px-6 py-24">
        <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Claude Integration */}
          <div className="lg:pr-8">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-4 text-black" style={{ letterSpacing: '-0.03em' }}>
                Claude Desktop Integration
              </h2>
              <p className="text-black/70 text-lg max-w-md">
                Connect Nocturne directly to Claude via the Model Context Protocol (MCP). Add this snippet to your Claude Desktop config.
              </p>
            </div>
            
            <div className="bg-[#1C1C1E] rounded-xl overflow-hidden shadow-2xl border border-black/5">
              {/* Mac Window Header */}
              <div className="bg-[#2D2D2F] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                <div className="ml-4 flex-1 text-center text-white/50 text-xs font-medium font-mono">claude_desktop_config.json</div>
              </div>
              
              {/* Code Content */}
              <div className="p-6 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-[#A8B2C1] leading-relaxed">
                  <code>
<span className="text-[#E06C75]">{"{"}</span>{`
  `}
<span className="text-[#98C379]">"mcpServers"</span><span className="text-[#E06C75]">:</span>{` `}<span className="text-[#E06C75]">{"{"}</span>{`
    `}
<span className="text-[#98C379]">"nocturne"</span><span className="text-[#E06C75]">:</span>{` `}<span className="text-[#E06C75]">{"{"}</span>{`
      `}
<span className="text-[#98C379]">"command"</span><span className="text-[#E06C75]">:</span>{` `}<span className="text-[#98C379]">"node"</span><span className="text-white">,</span>{`
      `}
<span className="text-[#98C379]">"args"</span><span className="text-[#E06C75]">:</span>{` `}<span className="text-white">[</span>{`
        `}
<span className="text-[#98C379]">"/path/to/weth/apps/mcp-server/dist/index.js"</span>{`
      `}
<span className="text-white">]</span>{`
    `}
<span className="text-[#E06C75]">{"}"}</span>{`
  `}
<span className="text-[#E06C75]">{"}"}</span>{`
`}
<span className="text-[#E06C75]">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
          
          {/* Right Column: Original Video Card */}
          <div className="relative rounded-3xl overflow-hidden min-h-[600px] lg:min-h-[720px] w-full">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="object-cover absolute inset-0 w-full h-full"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4"
            />
            
            <div className="relative z-10 p-8 lg:p-12">
              <h3 className="text-4xl lg:text-5xl font-medium leading-tight mb-5 text-black" style={{ letterSpacing: '-0.03em' }}>
                Commerce
              </h3>
              <p className="text-black/70 text-base max-w-md mb-8">
                Lift customer retention by offering Nocturne, a trusted privacy-first digital currency with strong yields, letting your patrons earn with zero effort on your platform.
              </p>
              
              <a href="#" className="inline-flex items-center gap-3 group text-black font-medium">
                <span className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center group-hover:bg-white transition-colors">
                  <ArrowRight className="w-4 h-4 text-black" />
                </span>
                Know more
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
