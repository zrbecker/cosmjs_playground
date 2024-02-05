import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { useCallback, useEffect, useState } from "react";
import useLocalStorageState from "./useLocalStorageState";

declare global {
  interface Window extends KeplrWindow {}
}

export default function useKeplr(chainIds: string[]) {
  const [connected, setConnected] = useLocalStorageState<string[]>(
    "keplr-connected",
    []
  );

  const [keplr, setKeplr] = useState<Keplr | null>(() => {
    if (chainIds.every((chainId) => connected.includes(chainId))) {
      try {
        return getKeplrGlobal();
      } catch (e) {
        console.error(e);
        setConnected([]);
      }
    }
    return null;
  });

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
    let enableChainIds = chainIds;

    while (enableChainIds.length > 0) {
      try {
        await getKeplrGlobal().enable(enableChainIds);
        setConnected(enableChainIds);
        setKeplr(cloneObject(getKeplrGlobal()));
        return;
      } catch (e: any) {
        if (typeof e?.message !== "string") {
          console.log("No message in error", e);
          throw e;
        }

        const unsupportedChainId = getUnsupportedChainId(e?.message);
        if (!unsupportedChainId) {
          throw e;
        }

        const currentLength = enableChainIds.length;
        enableChainIds = enableChainIds.filter(
          (chainId) => chainId !== unsupportedChainId
        );

        if (currentLength === enableChainIds.length) {
          throw e;
        }
      }
    }
  }, [chainIds, setConnected]);

  const disconnect = useCallback(async () => {
    await getKeplrGlobal().disable();
    setConnected([]);
    setKeplr(null);
  }, [setConnected]);

  return { keplr, connect, disconnect };
}

function getUnsupportedChainId(message: string) {
  const pattern = /There is no chain info for ([-a-zA-Z0-9]{3,47})/;
  const match = message.match(pattern);

  if (match) {
    return match[1];
  } else {
    return null;
  }
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
