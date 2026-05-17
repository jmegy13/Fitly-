export function readStorage<T>(key: string, fallback: T, legacyKey?: string): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key) ?? (legacyKey ? window.localStorage.getItem(legacyKey) : null);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string, legacyKey?: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
  if (legacyKey) window.localStorage.removeItem(legacyKey);
}
