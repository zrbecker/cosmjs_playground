"use client";

import { AccountData } from "@keplr-wallet/types";
import useKeplr from "@/hooks/keplr/useKeplr";
import { useEffect, useState } from "react";
import { toBase64 } from "@cosmjs/encoding";

export default function ConvertPubKey() {
  const { connected, nonce, connect, disconnect, keplr } = useKeplr([
    "cosmoshub-4",
    "osmosis-1",
  ]);
  const [account, setAccount] = useState<AccountData | null>(null);

  useEffect(() => {
    if (keplr && connected) {
      keplr
        .getOfflineSigner("cosmoshub-4")
        .getAccounts()
        .then((accounts) => setAccount(accounts[0]))
        .catch((e) => console.error(e));
    } else if (account != null) {
      setAccount(null);
    }
  }, [account, connected, keplr, nonce]);

  return (
    <div className="flex flex-col space-y-4 pt-4 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col space-y-3">
        <h2 className="text-xl font-medium">Keplr Accounts</h2>
        <div className="flex space-x-2 items-start">
          {!connected ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
              type="button"
              onClick={connect}
            >
              Connect
            </button>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
              type="button"
              onClick={disconnect}
            >
              Disconnected
            </button>
          )}
        </div>
        {account ? (
          <div>
            <div>
              <span className="inline-block w-44">Address (Bech32): </span>
              {account.address}
            </div>
            <div>
              <span className="inline-block w-44">Algo: </span>
              {account.algo}
            </div>
            <div>
              <span className="inline-block w-44">Public Key (Base64): </span>
              {toBase64(account.pubkey)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
