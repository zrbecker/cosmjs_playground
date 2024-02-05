import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { useCallback, useEffect, useState } from "react";
import useLocalStorageState from "./useLocalStorageState";

declare global {
  interface Window extends KeplrWindow {}
}

export default function useKeplr(chainIds: string[]) {
  const [loading, setLoading] = useState(true);
  const [keplr, setKeplr] = useState<Keplr | null>(null);
  const [connected, setConnected] = useLocalStorageState<string[]>(
    "keplr-connected",
    []
  );

  useEffect(() => {
    if (loading) {
      setLoading(false);
      if (chainIds.every((chainId) => connected.includes(chainId))) {
        try {
          setKeplr(getKeplrGlobal());
        } catch (e) {
          console.error(e);
          setConnected([]);
        }
      } else {
        setKeplr(null);
      }
    }
  }, [loading, chainIds, connected, setConnected]);

  const isConnected = Boolean(keplr);
  useEffect(() => {
    if (isConnected) {
      const triggerUpdate = () => setKeplr(cloneObject(getKeplrGlobal()));
      window.addEventListener("keplr_keystorechange", triggerUpdate);
      return () =>
        window.removeEventListener("keplr_keystorechange", triggerUpdate);
    }
  }, [isConnected]);

  const connect = useCallback(async () => {
    await getKeplrGlobal().enable(chainIds);
    setConnected(chainIds);
    setKeplr(cloneObject(getKeplrGlobal()));
  }, [chainIds, setConnected]);

  const disconnect = useCallback(async () => {
    await getKeplrGlobal().disable();
    setConnected([]);
    setKeplr(null);
  }, [setConnected]);

  return { keplr, connect, disconnect };
}

function getKeplrGlobal() {
  if (window.keplr) {
    return window.keplr;
  }
  throw new Error("Keplr not found in window");
}

function cloneObject(obj: any) {
  const clone = Object.create(Object.getPrototypeOf(obj));

  const props = Object.getOwnPropertyNames(obj);
  const symbols = Object.getOwnPropertySymbols(obj);
  const allProps = [...props, ...symbols];

  allProps.forEach((prop) => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (!descriptor) return;
    Object.defineProperty(clone, prop, descriptor);
  });

  return clone;
}
