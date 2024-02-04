"use client";

import { sha256 } from "@cosmjs/crypto";
import { fromBase64, toHex } from "@cosmjs/encoding";
import { useState } from "react";

const EXAMPLE_TX =
  "9AEoKBapCjCMTXENChQmiMbn/hEgc2noEV+vJkHASIhPShIUU7SyT3IQK/OJv+xZUz5LP9dR4FQKPpIdLk4KFCaIxuf+ESBzaegRX68mQcBIiE9KEhRTtLJPchAr84m/7FlTPks/11HgVBoMCgV1YXRvbRIDMTQ1EhAKCgoFdWF0b20SATAQ4KcSGmoKJuta6YchA9E/2C2Tibu+oguuOS2AwO9sGwy1ejes+u8hBdGJ2guiEkBZ7JjaZhENW56nbqaUH0SdgnuWHmPlPfgWs2LVwbOj6BDacUL+vcKqd4vxmkYRB9ORmqnDlj9ppaupmIPnOQuK";

export default function TxHash() {
  const [txHash, setTxHash] = useState<string>("");
  const [txId, setTxId] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTxId(toHex(sha256(fromBase64(txHash))).toUpperCase());
  }

  return (
    <div className="flex flex-col space-y-4 pt-4 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-medium">Transaction ID Generator</h2>
        <form
          className="mt-2 flex flex-col items-start space-y-3"
          onSubmit={handleSubmit}
        >
          <textarea
            className="w-full h-32 dark:bg-gray-700 shadow appearance-none border rounded px-3 py-2 leading-tight"
            placeholder="Enter encoded transaction"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
          />
          <div
            className="cursor-pointer underline"
            onClick={() => {
              setTxHash(EXAMPLE_TX);
            }}
          >
            Load Example Tx
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
            type="submit"
          >
            Generate
          </button>
        </form>
      </div>

      {txId == "" ? null : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-wrap break-all">
          <h3 className="text-xl font-medium">Transaction ID</h3>
          <p className="mt-2 font-mono">{txId}</p>
        </div>
      )}
    </div>
  );
}
