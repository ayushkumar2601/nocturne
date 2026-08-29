import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weth — Zero-Trust AI Agent Wallet & Signing Console",
  description:
    "Zero stress, total control. Weth keeps you covered with unbreakable Model Context Protocol drafting, human-in-the-loop signing, and pro-grade tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/04e6981992c0e2e7642af2074ebe3901?family=Helvetica+Now+Display+Bold"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
