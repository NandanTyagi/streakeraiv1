# Streaker AI V3 (src-v3)

This directory is a parallel rebuild of Streaker AI following the V3 constitution and use-case algebra. It is event-sourced, deterministic, and replayable. Existing V1/V2 code remains untouched.

## Architecture

- **Domain (`src-v3/domain`)**: Pure deterministic logic, types, invariants, DayState rules, streak engine, event replay.
- **Application (`src-v3/application`)**: Use cases implement `Command -> Events -> State -> Projections`, with projections for dashboard, monthly grid, history, and AI grounding.
- **Infrastructure (`src-v3/infrastructure`)**: Adapters for Mongo event store, projection repository, OpenAI, Kinde auth, clock, timezone, and legacy migration bridge.
- **Interface (`src-v3/interface`)**: V3 API handlers mapping endpoints to use cases. No business logic in routes.

## Event Model

Canonical events are defined in `src-v3/domain/events.ts` with versioned payloads and idempotency keys. Event replay (`src-v3/domain/replay.ts`) is the source of truth; projections are derived and rebuildable.

## Streak Engine

Streaks are a pure fold over DayState history (`src-v3/domain/streaks.ts`). Only `done` and `not_done` are persisted; `missed` and `unreviewed` are derived at projection time.

## AI Grounding Flow

AI is a pure function of projections:

`State -> Projections -> AIGroundingContext -> AI Reflection`

The grounding context includes event stream, streak stats, recent DayStates, and goal-habit topology. See `src-v3/application/projections/builders.ts` and `src-v3/application/use-cases/ai.ts`.

## Migration Bridge

`src-v3/infrastructure/legacy/panel-to-v3-mapper.ts` maps legacy Panel documents into V3 events so projections can be built without disrupting production data.

`src-v3/scripts/migration-dry-run.ts` demonstrates a dry-run conversion (requires `MONGODB_URI`).

## Tests

Domain tests live in `src-v3/tests/domain.test.ts`. Run via `npm run test:v3` (ts-node), or wire into your preferred test framework.

## UI Switch to V3

Once `/api/v3/*` is wired into Next routes, add a feature flag `USE_V3_ENGINE` and update the UI data sources:

1) Grid reads from `/api/v3/day-states`
2) Save writes to `/api/v3/upsert-day`
3) Dashboard uses `/api/v3/streaks`
4) History uses `/api/v3/history`
5) AI uses `/api/v3/ai/daily` and `/api/v3/ai/weekly`

The V1 UI remains intact; only the data source changes under the flag.
