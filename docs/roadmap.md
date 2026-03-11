# Roadmap

## Current Goal

Deliver an MVP where a user can follow channels, watch embedded videos, receive explainable recommendations, and export/import algorithm profiles.

## Completed

- scoped v1 feature boundaries and non-goals
- selected stack and runtime architecture
- defined database model and ranking pipeline stages

## Next Slices

1. `feat/foundation-runtime`
   - initialize Fastify and React apps
   - set up Prisma schema and migrations
   - add auth baseline and health checks
2. `feat/event-tracking`
   - add watch, skip, like, and save event ingestion
   - persist watched exclusion data
   - expose event-driven profile updates
3. `feat/recommendation-engine`
   - implement candidate generation sources
   - add filtering and normalized scoring
   - implement heap-based top-k selection and explanations
4. `feat/profile-portability`
   - implement JSON export for profile signals
   - implement validated import and isolated preview feed
   - add profile selection controls in the client
5. `feat/quality-hardening`
   - expand tests for ranking and profile flows
   - add lint/type/build gates in CI
   - close bug-log issues and publish release notes

## Exit Criteria

- [ ] server lint, typecheck, tests, and build pass
- [ ] client lint, typecheck, tests, and build pass
- [ ] recommendation responses include explanation metadata
- [ ] profile import/export works with validation
- [ ] docs stay synchronized with implementation slices
