/**
 * Thin client for the Go backend (see backend/README.md). Every function
 * here fails soft: a network error or non-2xx response resolves to `null`
 * instead of throwing, because the whole site already works from
 * localStorage alone — the backend is a nice-to-have sync layer, not a
 * dependency the UI should ever block on or break over.
 */
import type { TopicState } from "@/composables/useProgress";

/**
 * Where the backend lives, if anywhere.
 *
 * This used to default to `http://localhost:8080` unconditionally, which was
 * wrong in two ways. In a deployed build with no `VITE_API_URL` set, every
 * visitor's browser would try to open a connection to *their own* machine's
 * port 8080. And locally, with no backend running, each navigation fired
 * requests that failed with ERR_CONNECTION_REFUSED — noisy in a console this
 * site actively tells people to open.
 *
 * The localhost fallback now applies only in dev, where it is a convenience.
 * With no URL configured in a production build, sync is simply off and the
 * site runs from localStorage, which it is designed to do anyway.
 */
const CONFIGURED = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = CONFIGURED || (import.meta.env.DEV ? "http://localhost:8080" : "");
const TIMEOUT_MS = 5000;

/**
 * Once the backend has proved unreachable, stop asking for the rest of the
 * session. Every progress mutation calls through here, so without this a
 * missing backend costs a failed request and a console error on every single
 * topic the reader marks.
 */
let reachable = API_BASE !== "";

export interface ApiUser {
  id: number;
  username: string;
  created_at: string;
}

export interface ApiProgress {
  tasks: Record<string, TopicState>;
  projects: string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!reachable) return null;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    // Backend unreachable, timed out, or offline. Callers treat this the
    // same as "no server available."
    //
    // A refused connection means nothing is listening, so stop trying for
    // this session. An abort (our own timeout) or a transient error is not
    // treated as fatal — the server may just be slow or briefly down.
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      reachable = false;
    }
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

/** Creates the user if new, otherwise just returns the existing one. */
export function identifyUser(username: string) {
  return request<ApiUser>("/api/users", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export function fetchProgress(username: string) {
  return request<ApiProgress>(`/api/users/${encodeURIComponent(username)}/progress`);
}

export function pushTaskStatus(username: string, itemId: string, status: TopicState | null) {
  const body = status ? { type: "task", item_id: itemId, status } : { type: "task", item_id: itemId, completed: false };
  return request<{ ok: boolean }>(`/api/users/${encodeURIComponent(username)}/progress`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function pushProjectStatus(username: string, itemId: string, completed: boolean) {
  return request<{ ok: boolean }>(`/api/users/${encodeURIComponent(username)}/progress`, {
    method: "PUT",
    body: JSON.stringify({ type: "project", item_id: itemId, completed }),
  });
}
