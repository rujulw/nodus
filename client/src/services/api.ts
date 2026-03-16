/// <reference types="vite/client" />
const BASE = '/api/v1';
const TOKEN = import.meta.env.VITE_API_TOKEN ?? '';

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

export async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  // ── Intercept with Mock Data ───────────────────────────────────────────────
  if (path === '/videos/feed') {
    const res = await fetch('/mock-data/feed.json');
    return res.json() as Promise<T>;
  }

  if (path.startsWith('/videos/')) {
    const videoId = path.split('/').pop() || '';
    const res = await fetch(`/mock-data/video-${videoId}.json`);
    if (!res.ok) throw new Error(`Video ${videoId} not found in mock data`);
    return res.json() as Promise<T>;
  }

  const url = new URL(BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), { headers: headers() });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  // ── Mock static response for event recording ──────────────────────────────
  if (path === '/events' || path === '/events/batch') {
    return { event: body, accepted: 1 } as unknown as T;
  }

  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
