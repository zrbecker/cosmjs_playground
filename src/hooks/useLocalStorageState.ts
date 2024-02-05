import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorageState<S>(
  storageKey: string,
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const value = localStorage.getItem(storageKey);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [storageKey, state]);

  return [state, setState] as const;
}
