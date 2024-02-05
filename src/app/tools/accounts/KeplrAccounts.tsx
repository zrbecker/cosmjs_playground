"use client";

import { AccountData } from "@keplr-wallet/types";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import useKeplr from "@/hooks/useKeplr";
import { useEffect, useState } from "react";
import { toBase64 } from "@cosmjs/encoding";
import dynamic from "next/dynamic";

const DEFAULT_CHAIN_IDS = ["cosmoshub-4", "osmosis-1"];

export default function KeplrAccounts() {
  const [chainIds, setChainIds] = useLocalStorageState(
    "keplr-accounts-chain-ids",
    DEFAULT_CHAIN_IDS
  );
  const { keplr, connect, disconnect } = useKeplr(chainIds);
  const [accounts, setAccounts] = useState<{ [key: string]: AccountData }>({});

  const [newChainId, setNewChainId] = useState("");

  useEffect(() => {
    if (keplr) {
      for (const chainId of chainIds) {
        keplr
          .getOfflineSigner(chainId)
          .getAccounts()
          .then((keplrAccounts) =>
            setAccounts((accounts) => ({
              ...accounts,
              [chainId]: keplrAccounts[0],
            }))
          )
          .catch((e) => console.error(e));
      }
    } else {
      setAccounts({});
    }
  }, [chainIds, keplr]);

  function addChain(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newChainId && !chainIds.includes(newChainId)) {
      setChainIds([...chainIds, newChainId]);
      setNewChainId("");
    }
  }

  function removeChain(chainId: string) {
    setChainIds(chainIds.filter((id) => id !== chainId));
  }

  return (
    <div className="flex flex-col space-y-4 pt-4 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col space-y-3">
        <h2 className="text-xl font-medium">Chains</h2>
        <ul className="flex flex-col space-y-3">
          {chainIds.map((chainId) => (
            <li key={chainId} className="flex space-x-3">
              <div
                className="inline-block flex items-center justify-center w-6 h-6 bg-red-500 hover:bg-red-700 cursor-pointer rounded-full"
                onClick={(e) => removeChain(chainId)}
              >
                <span className="text-white">X</span>
              </div>
              <div>{chainId}</div>
            </li>
          ))}
        </ul>
        <div className="border-b border-gray-200"></div>
        <form
          className="flex flex-col space-y-3 items-start"
          onSubmit={addChain}
        >
          <h3 className="text-lg font-medium">Add Chain ID</h3>
          <div className="flex space-x-2 justify-center">
            <input
              type="text"
              className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded "
              placeholder="cosmoshub-4"
              value={newChainId}
              onChange={(e) => setNewChainId(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold px-2 py-1 rounded"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col space-y-3">
        <h2 className="text-xl font-medium">Keplr Accounts</h2>
        <div className="flex space-x-2 items-start">
          {!keplr ? (
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
        <div>
          {chainIds.map((chainId, i) => {
            const account = accounts[chainId];
            if (account === undefined) return null;
            return (
              <>
                {i !== 0 ? (
                  <div className="border-b border-gray-200 my-3"></div>
                ) : null}
                <div key={chainId}>
                  <h3 className="text-lg font-medium">{chainId}</h3>
                  <div>
                    <span className="inline-block w-44">
                      Address (Bech32):{" "}
                    </span>
                    {account.address}
                  </div>
                  <div>
                    <span className="inline-block w-44">Algo: </span>
                    {account.algo}
                  </div>
                  <div>
                    <span className="inline-block w-44">
                      Public Key (Base64):{" "}
                    </span>
                    {toBase64(account.pubkey)}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
