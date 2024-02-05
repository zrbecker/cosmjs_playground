import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect, useState } from "react";

declare global {
  interface Window extends KeplrWindow {}
}

const KEPLR_WALLET_CONNECTED = "keplr-wallet-connected";

export default function useKeplr(chainIds: string | string[]) {
  const [initialized, setInitialized] = useState(false);
  const [connected, setConnected] = useState(false);
  const [nonce, setNonce] = useState(0);

  // recover connected state from local storage
  useEffect(() => {
    if (initialized) return;

    let connectedStorage = false;
    try {
      connectedStorage = Boolean(
        JSON.parse(window.localStorage.getItem(KEPLR_WALLET_CONNECTED) || "")
      );
    } catch (e) {}
    setConnected(connectedStorage);

    setInitialized(true);
  }, [initialized]);

  // persist connected state to local storage
  useEffect(() => {
    if (!initialized) return;

    window.localStorage.setItem(
      KEPLR_WALLET_CONNECTED,
      JSON.stringify(connected)
    );
  }, [initialized, connected]);

  // listen for keystore changes
  useEffect(() => {
    window.addEventListener("keplr_keystorechange", (e) => {
      setNonce((nonce) => nonce + 1);
    });
  }, []);

  // connect keplr wallet handler
  const connect = async () => {
    if (connected) {
      throw new Error("Keplr already connected");
    }

    if (!window.keplr) {
      throw new Error("Keplr extension not installed");
    }

    await window.keplr.enable(chainIds);
    setConnected(true);
  };

  // disconnect keplr wallet handler
  const disconnect = async () => {
    if (!connected) {
      throw new Error("Keplr already disconnected");
    }

    if (!window.keplr) {
      throw new Error("Keplr extension not installed");
    }

    window.keplr.disable();
    window.localStorage.setItem(KEPLR_WALLET_CONNECTED, JSON.stringify(false));
    setConnected(false);
  };

  const keplr = typeof window !== "undefined" ? window.keplr : undefined;
  return { connected, nonce, connect, disconnect, keplr };
}
