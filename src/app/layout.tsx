import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CosmJS Playground",
  description: "CosmJS Playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed h-screen bg-gray-800 text-white w-64 space-y-6 py-7 px-2 overflow-auto">
          <ul>
            <Link href="/">
              <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                Home
              </li>
            </Link>
            <Link href="/tools/generate_transaction_id">
              <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                Transaction ID Generator
              </li>
            </Link>
            <Link href="/tools/convert_address">
              <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                Bech32 Address Converter
              </li>
            </Link>
            <Link href="/tools/accounts">
              <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                Keplr Accounts
              </li>
            </Link>
            <Link href="/tools/generate_wallet">
              <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                Generate Wallet
              </li>
            </Link>
          </ul>
        </div>
        <div className="ml-64">{children}</div>
      </body>
    </html>
  );
}
