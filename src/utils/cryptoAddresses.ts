import {
  Bip39,
  EnglishMnemonic,
  Random,
  Secp256k1,
  Slip10,
  Slip10Curve,
  keccak256,
  ripemd160,
  sha256,
  stringToPath,
} from "@cosmjs/crypto";

export type KeyPair = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

export function createMnemonic(entropyBytes: number): string {
  return Bip39.encode(Random.getBytes(entropyBytes)).toString();
}

export async function privateKeyFromMnemonic(
  mnemonic: string,
  hdPath: string
): Promise<KeyPair> {
  const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(mnemonic));

  const { privkey: privateKey } = Slip10.derivePath(
    Slip10Curve.Secp256k1,
    seed,
    stringToPath(hdPath)
  );
  const { pubkey: publicKey } = await Secp256k1.makeKeypair(privateKey);

  return {
    privateKey: privateKey,
    publicKey: publicKey,
  };
}

export function rawCosmosAddress(publicKey: Uint8Array): Uint8Array {
  return ripemd160(sha256(Secp256k1.compressPubkey(publicKey)));
}

export function rawEvmAddress(publicKey: Uint8Array): Uint8Array {
  return keccak256(publicKey.slice(1)).slice(12);
}
