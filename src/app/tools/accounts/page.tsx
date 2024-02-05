"use client";

import dynamic from "next/dynamic";

const KeplrAccounts = dynamic(
  () => import("@/app/tools/accounts/KeplrAccounts"),
  {
    ssr: false,
  }
);

export default function KeplrAccountsPage() {
  return <KeplrAccounts />;
}
