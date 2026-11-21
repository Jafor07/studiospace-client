import { useSyncExternalStore } from "react";
import { apiRequest } from "@/app/lib/client-api";

// A tiny shared store, so every heart button on the page knows which
// studios are saved without each one asking the server separately.
const EMPTY = { ids: new Set(), loaded: false };
let state = EMPTY;
let loading = false;
const listeners = new Set();

function setState(next) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function useWishlist() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => EMPTY,
  );
}

export async function loadWishlist() {
  if (state.loaded || loading) return;
  loading = true;
  const res = await apiRequest("/wishlist");
  loading = false;
  if (res.ok && Array.isArray(res.data)) {
    setState({ ids: new Set(res.data), loaded: true });
  }
}

export function resetWishlist() {
  setState(EMPTY);
}

// Flip the heart right away, then tell the server. Undo if the server says no.
export async function toggleWishlist(studioId) {
  const before = state;
  const ids = new Set(before.ids);
  if (ids.has(studioId)) ids.delete(studioId);
  else ids.add(studioId);
  setState({ ids, loaded: true });

  const res = await apiRequest(`/wishlist/${studioId}`, { method: "POST" });
  if (!res.ok) setState(before);
  return res;
}
