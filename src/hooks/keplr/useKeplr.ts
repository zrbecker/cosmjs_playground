import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect, useState } from "react";

declare global {
  interface Window extends KeplrWindow {}
}

export default function useKeplr(chainIds: string | string[]) {
  const [keplr, setKeplr] = useState<Keplr | null>(null);

  useEffect(() => {
    if (getIsConnected()) {
      try {
        setKeplr(getKeplrGlobal());
      } catch (e) {
        console.error(e);
        setIsConnected(false);
      }
    }
  }, []);

  const isConnected = Boolean(keplr);
  useEffect(() => {
    if (isConnected) {
      const triggerUpdate = () => setKeplr(cloneObject(getKeplrGlobal()));
      window.addEventListener("keplr_keystorechange", triggerUpdate);
      return () =>
        window.removeEventListener("keplr_keystorechange", triggerUpdate);
    }
  }, [isConnected]);

  const connect = async () => {
    await getKeplrGlobal().enable(chainIds);
    setIsConnected(true);
    setKeplr(cloneObject(getKeplrGlobal()));
  };

  const disconnect = async () => {
    await getKeplrGlobal().disable();
    setIsConnected(false);
    setKeplr(null);
  };

  return { keplr, connect, disconnect };
}

const LS_KEY_CONNECTED = "keplr-wallet-connected";

function getIsConnected() {
  try {
    return Boolean(
      JSON.parse(window.localStorage.getItem(LS_KEY_CONNECTED) || "")
    );
  } catch (e) {
    return false;
  }
}

function setIsConnected(connected: boolean) {
  window.localStorage.setItem(LS_KEY_CONNECTED, JSON.stringify(connected));
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
