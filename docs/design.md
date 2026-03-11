# Design Log

## Define v1 API contracts for channels, videos, and user events
- Status: accepted
- Area: server
- Decision: establish explicit request/response and validation contracts before route implementation.
- Context: recommendation behavior depends on event integrity and consistent feed payloads.
- Options:
  - A: write contracts first as docs, TypeScript types, and JSON Schemas.
  - B: implement handlers first and infer contracts later.
- Tradeoffs:
  - Pros: reduces ambiguity, enables faster implementation and testing, and prevents payload drift.
  - Cons: may require contract updates when implementation details evolve.
- Follow-up:
  - wire these schemas into Fastify route validation in the next implementation slice
  - add contract tests to enforce parity between docs and runtime
- References: `server/contracts/api-contracts.md`

## Use PostgreSQL for v1 recommendation graph modeling
- Status: accepted
- Area: server
- Decision: model recommendation relationships in relational tables instead of introducing a graph database in v1.
- Context: the MVP must be shippable quickly while still supporting meaningful recommendation logic.
- Options:
  - A: PostgreSQL with normalized relationship and aggregate tables.
  - B: Neo4j-first architecture.
- Tradeoffs:
  - Pros: simpler deployment, faster delivery, familiar query tooling, and clear migration path later.
  - Cons: complex traversal requires careful query design and some pre-aggregation.
- Follow-up:
  - add query performance checks once event volume grows
  - revisit graph-native storage only if relational bottlenecks appear
- References: `docs/architecture.md`

## Keep MVP scope recommendation-centric
- Status: accepted
- Area: product
- Decision: ship recommendation pipeline and profile portability before social features.
- Context: project success criteria focus on recommendation transparency and algorithm ownership.
- Options:
  - A: recommendation-first MVP with minimal account system.
  - B: broad social platform MVP.
- Tradeoffs:
  - Pros: narrower delivery risk, clearer value proposition, stronger portfolio signal.
  - Cons: reduced early user engagement loops from social features.
- Follow-up:
  - evaluate social features only after pipeline quality and explainability are stable
- References: `README.md`

## Conflict handling for source prompts
- Status: accepted
- Area: process
- Decision: when prompt artifacts and live chat instructions conflict, live chat takes priority and the override is documented here.
- Context: workflow contracts require deterministic conflict resolution.
- Options:
  - A: prioritize latest explicit user instruction.
  - B: always prioritize template prompt text.
- Tradeoffs:
  - Pros: aligns implementation to current user intent.
  - Cons: may reduce strict reproducibility of template-generated output.
- Follow-up:
  - note each future override with date and rationale
- References: `AGENTS.md`
