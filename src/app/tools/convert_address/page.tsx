"use client";

import { fromBech32, toBech32, toHex } from "@cosmjs/encoding";
import { ethers } from "ethers";
import { useState } from "react";

export default function ConvertPubKey() {
  const [bech32Address, setBech32Address] = useState<string>("");
  const [bech32Prefix, setBech32Prefix] = useState<string>("");
  const [evmAddress, setEvmAddress] = useState<string>("");

  function updateBech32Address(e: React.ChangeEvent<HTMLInputElement>) {
    setBech32Address(e.target.value);
    if (e.target.value === "") {
      return;
    }

    try {
      const { prefix, data } = fromBech32(e.target.value);
      setBech32Prefix(prefix);
      setEvmAddress(ethers.getAddress(toHex(data)));
    } catch (error) {
      /* ignore error */
      console.error(error);
    }
  }

  function updateBech32Prefix(e: React.ChangeEvent<HTMLInputElement>) {
    setBech32Prefix(e.target.value);
    if (e.target.value === "") {
      return;
    }

    try {
      const { data } = fromBech32(bech32Address);
      setBech32Address(toBech32(e.target.value, data));
      setEvmAddress(ethers.getAddress(toHex(data)));
    } catch (error) {
      /* ignore error */
      console.error(error);
    }
  }

  function updateEvmAddress(e: React.ChangeEvent<HTMLInputElement>) {
    setEvmAddress(e.target.value);
    if (e.target.value === "") {
      return;
    }

    try {
      setBech32Address(toBech32(bech32Prefix, fromBech32(e.target.value).data));
    } catch (error) {
      /* ignore error */
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col space-y-4 pt-4 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-medium">Bech32 Address Converter</h2>
        <form className="mt-4 flex flex-col space-y-3">
          <div className="flex items-center">
            <label className="inline-block w-48">Bech32 Address: </label>
            <input
              type="text"
              className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded "
              placeholder="cosmos1c4k24jzduc365kywrsvf5ujz4ya6mwymy8vq4q"
              value={bech32Address}
              onChange={updateBech32Address}
            />
          </div>
          <div className="flex items-center">
            <label className="inline-block w-48">Bech32 Prefix: </label>
            <input
              type="text"
              className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded "
              placeholder="cosmos"
              value={bech32Prefix}
              onChange={updateBech32Prefix}
            />
          </div>
          <div className="flex items-center">
            <label className="inline-block w-48">EVM Address: </label>
            <input
              type="text"
              className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded "
              placeholder="0xC56Caac84de623Aa588E1c189a7242a93bADb89B"
              value={evmAddress}
              onChange={updateEvmAddress}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
