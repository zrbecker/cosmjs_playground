"use client";

import dynamic from "next/dynamic";

const GenerateWallet = dynamic(
  () => import("@/app/tools/generate_wallet/GenerateWallet"),
  {
    ssr: false,
  }
);

export default function KeplrAccountsPage() {
  return <GenerateWallet />;
}
