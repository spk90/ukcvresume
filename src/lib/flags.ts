export function isAiEnabled(): boolean {
  const raw = (import.meta as any)?.env?.VITE_ENABLE_AI;
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    // Default OFF unless explicitly enabled
    return false;
  }
  const v = String(raw).toLowerCase().trim();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}


