/**
 * Username-only "identity" — not authentication. It exists so a handful of
 * people sharing this site locally each see their own progress, nothing
 * more. See CLAUDE2.md for why this is deliberately this simple.
 */
import { ref, readonly } from "vue";
import { identifyUser } from "@/lib/api";

const STORAGE_KEY = "roadmap-username";

const username = ref<string | null>(localStorage.getItem(STORAGE_KEY));
const showLoginModal = ref(username.value === null);

/** Fired after the username changes (login, switch, or logout) so other
 * composables (namely useProgress) can (re)hydrate from the server. */
type Listener = (username: string | null) => void;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) listener(username.value);
}

/**
 * Sets the active username. Always succeeds locally (that's the whole
 * point — no password to get wrong), but also reports whether the backend
 * was reachable so the caller can show a small "you're offline" hint.
 */
async function setUsername(raw: string): Promise<{ ok: false } | { ok: true; synced: boolean }> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false };

  username.value = trimmed;
  localStorage.setItem(STORAGE_KEY, trimmed);
  showLoginModal.value = false;

  const remoteUser = await identifyUser(trimmed);
  notify();

  return { ok: true, synced: remoteUser !== null };
}

function logout() {
  username.value = null;
  localStorage.removeItem(STORAGE_KEY);
  showLoginModal.value = true;
  notify();
}

function onUserChange(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUser() {
  return {
    username: readonly(username),
    showLoginModal,
    setUsername,
    logout,
    onUserChange,
  };
}
