import { vi, describe, it, expect } from 'vitest';
import { watchStart, watchProgress, complete, like, skip, save, dispatchEvent, dispatchEventBatch } from '@/services/events';

// ── Mock fetch global ────────────────────────────────────────────────────────

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ event: { id: 'evt_123' }, accepted: 1 }),
});
vi.stubGlobal('fetch', mockFetch);

describe('Events Service', () => {
  it('watchStart returns a payload with eventType watch_start', () => {
    const evt = watchStart('vid_1');
    expect(evt.videoId).toBe('vid_1');
    expect(evt.eventType).toBe('watch_start');
    expect(evt.value).toBe(1);
    expect(evt.clientTs).toBeDefined();
  });

  it('watchProgress returns a payload clamped to [0,1]', () => {
    const evtUpper = watchProgress('vid_1', 1.5);
    const evtLower = watchProgress('vid_1', -0.5);
    expect(evtUpper.value).toBe(1);
    expect(evtLower.value).toBe(0);
  });

  it('complete, like, skip, save return corresponding eventTypes', () => {
    expect(complete('v').eventType).toBe('complete');
    expect(like('v').eventType).toBe('like');
    expect(skip('v').eventType).toBe('skip');
    expect(save('v').eventType).toBe('save');
  });

  it('dispatchEvent triggers a fetch request with payload', async () => {
    const payload = like('vid_1');
    await dispatchEvent(payload);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('dispatchEventBatch triggers a fetch request for batch route', async () => {
    const payload1 = like('vid_1');
    const payload2 = save('vid_2');
    await dispatchEventBatch([payload1, payload2]);
    expect(mockFetch).toBeCalled();
  });
});
