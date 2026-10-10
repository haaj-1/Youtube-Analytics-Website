// Main API (auth, YouTube, analytics) — Render
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// ML API (predictions, optimizer) — Hugging Face Spaces
export const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

/**
 * fetch wrapper that returns parsed JSON and throws an Error carrying the
 * server's `detail` message (FastAPI convention) when the request fails.
 */
export async function request(base, path, { method = 'GET', body, timeout = 90000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = typeof data.detail === 'string' ? data.detail : null;
      throw new Error(detail || `Request failed (${res.status})`);
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The server took too long to respond. Please try again.');
    if (err instanceof TypeError) throw new Error('Could not reach the server. Check your connection and try again.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const fmt = (n) => {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
};

export const fmtDuration = (s) => {
  const total = Math.max(0, Math.round(s || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};
