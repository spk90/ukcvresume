const STORAGE_KEY = 'openai_api_key';

// Prefer build-time env key if present; otherwise fall back to localStorage
export function getEffectiveApiKey(): string | null {
  const envKey = (import.meta as any)?.env?.VITE_OPENAI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && stored.trim().length > 0 ? stored.trim() : null;
  } catch {
    return null;
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {}
}

export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}


