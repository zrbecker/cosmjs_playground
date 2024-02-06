import {
  Bip39,
  EnglishMnemonic,
  Random,
  Secp256k1,
  Slip10,
  Slip10Curve,
  ripemd160,
  sha256,
  stringToPath,
} from "@cosmjs/crypto";
import { fromHex, toBase64, toBech32, toHex } from "@cosmjs/encoding";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function generateMnemonic(entropyBytes: number) {
  return Bip39.encode(Random.getBytes(entropyBytes)).toString();
}

function cosmosAddress(publicKey: string) {
  const sha256Hash = sha256(fromHex(publicKey));
  const rawAddress = ripemd160(sha256Hash);
  return toHex(rawAddress).toUpperCase();
}

async function generatePrivateKeyFromMnemonic(
  mnemonic: string,
  hdPath: string
) {
  const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(mnemonic));

  const { privkey: privateKey } = Slip10.derivePath(
    Slip10Curve.Secp256k1,
    seed,
    stringToPath(hdPath)
  );
  const { pubkey: publicKey } = await Secp256k1.makeKeypair(privateKey);
  return {
    privateKey: toHex(privateKey).toUpperCase(),
    publicKey: toHex(Secp256k1.compressPubkey(publicKey)).toUpperCase(),
  };
}

function generateAddress(publicKey: string) {
  ethers.computeAddress(publicKey);
}

export default function GenericWallet() {
  const [mnemonic, setMnemonic] = useState(
    "quantum cost labor narrow subject ball ethics math friend work badge chronic"
  );
  const [entropy, setEntropy] = useState(16);
  const [hdPath, setHdPath] = useState("m/44'/118'/0'/0/0");

  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [publicKey, setPublicKey] = useState<string | undefined>();

  useEffect(() => {
    if (mnemonic) {
      (async () => {
        const { privateKey, publicKey } = await generatePrivateKeyFromMnemonic(
          mnemonic,
          hdPath
        );
        setPrivateKey(privateKey);
        setPublicKey(publicKey);
      })();
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
          onClick={() => setMnemonic(generateMnemonic(entropy))}
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
        {privateKey && publicKey ? (
          <>
            <div>Private Key: {privateKey}</div>
            <div>Public Key: {publicKey}</div>
            <div>Public Key (Base64): {toBase64(fromHex(publicKey))}</div>
            <div>Cosmos Address: {cosmosAddress(publicKey)}</div>
            <div>
              Bech32 Address:{" "}
              {toBech32("cosmos", fromHex(cosmosAddress(publicKey)))}
            </div>
            <div>
              Ethereum Address: {ethers.computeAddress("0x" + publicKey)}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
