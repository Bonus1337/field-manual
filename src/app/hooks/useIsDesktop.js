import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)";

function getSnapshot() {
  if (typeof globalThis === "undefined" || !globalThis.matchMedia) {
    return true;
  }
  return globalThis.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return true;
}

function subscribe(callback) {
  const mql = globalThis.matchMedia(QUERY);

  if (mql.addEventListener) {
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  }

  mql.addListener(callback);
  return () => mql.removeListener(callback);
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
