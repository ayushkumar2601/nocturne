import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WETH Guardian — AI Security Copilot | Don't Sign Blind",
  description:
    "Analyze, simulate and understand every crypto transaction before approval. Powered by real-time EVM simulation and multi-hop threat graph intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('weth-theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-black transition-colors font-sans">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
              {children}
            </main>
            <footer className="w-full py-6 mt-16 border-t border-neutral-200 dark:border-neutral-900 text-center text-xs text-neutral-500 dark:text-neutral-400">
              <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">WETH Guardian ASP</span>
                  <span>— Don&apos;t Sign Blind.</span>
                </div>
                <div>
                  Protected by <span className="font-semibold text-neutral-900 dark:text-neutral-100">WETH Core Intelligence Layer</span>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
