import { post } from './api';
import type {
  RecordEventRequest,
  RecordEventResponse,
  RecordEventsBatchRequest,
  RecordEventsBatchResponse,
} from '@/contracts/api-contracts';

export async function dispatchEvent(payload: RecordEventRequest): Promise<RecordEventResponse> {
  return post<RecordEventResponse>('/events', payload);
}

export async function dispatchEventBatch(
  events: RecordEventRequest[]
): Promise<RecordEventsBatchResponse> {
  const payload: RecordEventsBatchRequest = { events };
  return post<RecordEventsBatchResponse>('/events/batch', payload);
}

// ── Event Builders ─────────────────────────────────────────────────────────

export function watchStart(videoId: string): RecordEventRequest {
  return {
    videoId,
    eventType: 'watch_start',
    value: 1,
    clientTs: new Date().toISOString(),
  };
}

export function watchProgress(videoId: string, ratio: number): RecordEventRequest {
  return {
    videoId,
    eventType: 'watch_progress',
    value: Math.max(0, Math.min(1, ratio)),
    clientTs: new Date().toISOString(),
  };
}

export function complete(videoId: string): RecordEventRequest {
  return {
    videoId,
    eventType: 'complete',
    value: 1,
    clientTs: new Date().toISOString(),
  };
}

export function like(videoId: string): RecordEventRequest {
  return {
    videoId,
    eventType: 'like',
    value: 1,
    clientTs: new Date().toISOString(),
  };
}

export function skip(videoId: string): RecordEventRequest {
  return {
    videoId,
    eventType: 'skip',
    value: 1,
    clientTs: new Date().toISOString(),
  };
}

export function save(videoId: string): RecordEventRequest {
  return {
    videoId,
    eventType: 'save',
    value: 1,
    clientTs: new Date().toISOString(),
  };
}
