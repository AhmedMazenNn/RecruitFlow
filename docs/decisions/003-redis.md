# ADR-003: Redis Usage Boundaries

**Status:** Accepted
**Date:** 2026-08-28

## Context

RecruitFlow needs caching, rate limiting, and background-job infrastructure. Redis is a
natural candidate, but the project rule is that Redis must never become a replacement for
durable relational data in PostgreSQL.

## Decision

Adopt **Redis** for specifically beneficial uses **only**:

- Caching (expensive queries, session/temporary state where loss is acceptable)
- Rate limiting
- Background-job infrastructure with Celery
- Temporary/distributed coordination state where justified

Redis MUST NOT be the source of truth for durable, recoverable application data. If a value
must survive restarts and be queryable/relational, it lives in PostgreSQL.

## Consequences

- **Positive:** fast caching/rate-limit/queue layer without compromising durability.
- **Negative/trade-off:** an additional running service in dev; must rigorously classify
  data as durable (Postgres) vs ephemeral (Redis) or we risk data loss.
- Introduced only once a concrete feature justifies it; not added to the scaffold yet.
