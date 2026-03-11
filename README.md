# nodus

nodus is a privacy-focused video discovery platform that generates recommendations through a transparent, graph-driven ranking algorithm.

The MVP focuses on one user account system, event-driven interest modeling, explainable feed ranking, and portable algorithm profiles.

## Vision

nodus emphasizes:

- user-owned recommendation preferences
- explainable ranking decisions
- practical full-stack engineering over overengineering
- portable profiles without exposing private viewing history

## MVP Scope

In scope:

- save and watch YouTube videos inside nodus
- track watch, skip, like, and save interaction events
- update lightweight topic and creator preference models
- generate recommendations with candidate, filter, score, and top-k ranking stages
- export and import algorithm profiles as JSON

Out of scope for v1:

- social graph features
- real-time collaboration
- advanced ML models
- graph database adoption

## Current Implementation Status

Current plan:
- Server API and persistence layer
- Client UI and recommendation runtime

## Documentation

- [Architecture](docs/architecture.md): System boundaries, data model, and ranking flow.
- [Roadmap](docs/roadmap.md): Milestones and implementation slices.
- [Design Log](docs/design.md): Accepted architecture and scope decisions.
- [Bug Log](docs/bug-log.md): Defect history and verification records.

## Tech Stack

### Server

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Prisma

### Client

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Project Structure

```text
nodus/
├── server/
├── client/
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   ├── design.md
│   └── bug-log.md
├── .gitignore
└── README.md
```

## Core Recommendation Pipeline

1. Candidate generation from followed channels, top topics, creator affinity, and optional imported profile boosts.
2. Filtering for watched items, duplicates, blocked channels, and duration mismatch.
3. Weighted scoring with normalized components (topic match, creator affinity, duration fit, novelty, recency, diversity).
4. Heap-based top-k selection for efficient feed ranking.
5. Result explanations returned as user-visible recommendation reasons.

## Data Model Summary

Primary entities:

- users, channels, videos, topics
- user_events
- user_topic_weights
- user_creator_affinity
- algorithm_profiles
- followed_channels, watched_videos

## Environment Variables

### Server (`server/.env`)

```env
DATABASE_URL=
YOUTUBE_API_KEY=
JWT_SECRET=
PORT=4000
```

### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_YOUTUBE_EMBED_ORIGIN=http://localhost:5173
```

## Quality Gates

```bash
# server
cd server && npm run lint && npm run typecheck && npm test && npm run build

# client
cd client && npm run lint && npm run typecheck && npm test && npm run build
```

## Development Workflow

1. finalize scope and design decisions in docs first
2. implement in reviewable slices on `development` and `feat/*` branches
3. keep tests and docs synchronized with each change
4. maintain explainability outputs for recommendation behavior
