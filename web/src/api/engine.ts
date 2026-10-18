// The ONLY place the UI talks to the engine. All engine access goes through this module.

const BASE_URL = (import.meta.env.VITE_ENGINE_URL ?? "http://localhost:8000").replace(/\/$/, "");

export interface WordBank {
  word: string;
  /** Single words only - the engine never returns finished lines. */
  perfect: string[];
  stress: string | null;
  syllables: number | null;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Engine responded ${res.status}`);
  }
  return (await res.json()) as T;
}

export function health(): Promise<{ status: string }> {
  return get("/health");
}

export function wordBank(word: string): Promise<WordBank> {
  return get(`/api/v1/wordbank?word=${encodeURIComponent(word)}`);
}
