import useLocalStorageState from "@/hooks/useLocalStorageState";
import {
  KeyPair,
  createMnemonic,
  privateKeyFromMnemonic,
  rawCosmosAddress,
  rawEvmAddress,
} from "@/utils/cryptoAddresses";
import { Secp256k1 } from "@cosmjs/crypto";
import { toBase64, toBech32, toHex } from "@cosmjs/encoding";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function GenerateWallet() {
  const [entropy, setEntropy] = useLocalStorageState(
    "generate_wallet_entropy",
    16
  );

  const [mnemonic, setMnemonic] = useLocalStorageState(
    "generate_wallet_mnemonic",
    () => createMnemonic(entropy)
  );

  const [hdPath, setHdPath] = useLocalStorageState(
    "generate_wallet_hdpath",
    "m/44'/118'/0'/0/0"
  );

  const [prefix, setPrefix] = useLocalStorageState(
    "generate_wallet_prefix",
    "cosmos"
  );

  const [keyPair, setKeyPair] = useState<KeyPair | null>();

  useEffect(() => {
    if (mnemonic) {
      privateKeyFromMnemonic(mnemonic, hdPath)
        .then(setKeyPair)
        .catch(console.error);
    }
  }, [mnemonic, hdPath]);

  return (
    <div className="flex flex-col space-y-4 pt-4 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col space-y-3">
        <h2 className="text-xl font-medium">Generate Wallet</h2>
        <div className="flex space-x-3 items-center">
          <label>Entropy Bytes</label>
          <select
            className="w-32 dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded"
            value={entropy}
            onChange={(e) => setEntropy(Number(e.target.value))}
          >
            <option value={16}>16</option>
            <option value={20}>20</option>
            <option value={24}>24</option>
            <option value={28}>28</option>
            <option value={32}>32</option>
          </select>
        </div>
        <div
          className="cursor-pointer underline"
          onClick={() => setMnemonic(createMnemonic(entropy))}
        >
          Generate Mnemonic
        </div>
        <input
          type="text"
          className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded"
          placeholder="quantum cost labor narrow subject ball ethics math friend work badge chronic"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <input
          type="text"
          className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded"
          placeholder="m/44'/118'/0'/0/0"
          value={hdPath}
          onChange={(e) => setHdPath(e.target.value)}
        />
        <input
          type="text"
          className="flex-grow dark:bg-gray-700 px-3 py-2 leading-tight shadow border rounded"
          placeholder="cosmos"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        {keyPair ? (
          <>
            <div>Private Key: {toHex(keyPair.privateKey).toUpperCase()}</div>
            <div>
              Public Key (Uncompressed):{" "}
              {toHex(keyPair.publicKey).toUpperCase()}
            </div>
            <div>
              Public Key (Compressed):{" "}
              {toHex(Secp256k1.compressPubkey(keyPair.publicKey)).toUpperCase()}
            </div>
            <div>Public Key (Base64): {toBase64(keyPair.publicKey)}</div>
            <div>
              Cosmos Address:{" "}
              {ethers.getAddress(toHex(rawCosmosAddress(keyPair.publicKey)))}
            </div>
            <div>
              Cosmos Bech32 Address:{" "}
              {toBech32(prefix, rawCosmosAddress(keyPair.publicKey))}
            </div>
            <div>
              EVM Address:{" "}
              {ethers.getAddress(toHex(rawEvmAddress(keyPair.publicKey)))}
            </div>
            <div>
              EVM Bech32 Address:{" "}
              {toBech32(prefix, rawEvmAddress(keyPair.publicKey))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
