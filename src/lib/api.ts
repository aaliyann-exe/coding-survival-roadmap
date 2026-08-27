/**
 * Thin client for the Go backend (see backend/README.md). Every function
 * here fails soft: a network error or non-2xx response resolves to `null`
 * instead of throwing, because the whole site already works from
 * localStorage alone — the backend is a nice-to-have sync layer, not a
 * dependency the UI should ever block on or break over.
 */
import type { TopicState } from "@/composables/useProgress";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";
const TIMEOUT_MS = 5000;

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
  } catch {
    // Backend unreachable, timed out, or offline. Callers treat this the
    // same as "no server available."
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
