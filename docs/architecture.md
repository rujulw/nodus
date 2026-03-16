# Architecture

## Overview

nodus is a full-stack TypeScript application that ingests YouTube metadata, tracks user interactions, maintains preference signals, and serves explainable recommendations.

## Boundaries

- Client: React app for feed browsing, embedded playback, event tracking, and profile import/export.
- Server: Fastify API for auth, metadata ingestion, event persistence, profile serialization, and recommendation generation.
- Shared contracts: Typed REST payloads for videos, events, ranked feed items, and profile JSON.

## Client Information Architecture & Routes

The React client shell defines three primary route boundaries under a shared `AppShell` layout (providing global navigation via `AppNav` and content constraints via `PageLayout`):

1. **`/` (FeedPage)**
   - Renders a ranked video feed with modes (`for_you` | `explore`)
   - Accepts user interactions (like, skip, save) handled via event dispatch
   - Data dependency: `GET /api/v1/videos/feed`

2. **`/watch/:videoId` (WatchPage)**
   - Manages an embedded YouTube player (`youtube-nocookie.com`)
   - Dispatches timeline events (`watch_start`, `watch_progress`, `complete`) automatically
   - Provides sidebar controls for manual interaction logic
   - Data dependency: `GET /api/v1/videos/:videoId`

3. **`*` (NotFoundPage)**
   - Boundary for unhandled routes and 404 fallbacks

Contract source of truth:

- `server/contracts/api-contracts.md`
- `server/contracts/api-contracts.ts`
- `server/contracts/api-schemas.json`

## Runtime Flow

1. User follows channels or saves video links.
2. Server fetches and caches required YouTube metadata.
3. User interactions are captured from feed and player pages.
4. Preference aggregates update topic weights and creator affinity.
5. Recommendation pipeline generates ranked feed candidates with explanations.
6. Client renders ranked cards and explanation chips per item.

## Recommendation Pipeline

1. Candidate generation:
   - recent uploads from followed channels
   - videos matching high-weight topics
   - videos from high-affinity creators
   - optional imported profile boosts
2. Filtering:
   - watched exclusion
   - duplicate removal
   - blocked channel exclusion
   - duration band constraints
3. Scoring:
   - weighted normalized score components
4. Ranking:
   - heap-based top-k selection
5. Explainability:
   - top score contributors returned per item

## Metadata Ingestion Layer

- Service: `server/src/youtube/metadata-ingestion-service.ts`
- Client: `server/src/youtube/youtube-client.ts`
- Cache: `server/src/cache/lru-ttl-cache.ts` and `server/src/youtube/metadata-cache.ts`
- Runtime: Fastify plugin decorates `youtubeIngestionService` when `YOUTUBE_API_KEY` is configured.

## Data Model

Core tables:

- `users`
- `channels`
- `videos`
- `topics`
- `video_topics`
- `user_events`
- `user_creator_affinity`
- `user_topic_weights`
- `algorithm_profiles`
- `followed_channels`
- `watched_videos`

## Security and Privacy

- token-based auth for API access
- scoped profile export that excludes raw watch history
- import validation for schema and value ranges
- rate limiting on ingestion and event endpoints

## Operational Notes

- local run target: `npm run dev` in both `server/` and `client/`
- health endpoint: `/health`
- first deployment target: Render, Railway, or Fly.io with managed PostgreSQL
