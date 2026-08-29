# ADR-006: Search Strategy — PostgreSQL First

**Status:** Accepted
**Date:** 2026-08-28

## Context

Recruiters need to search/filter candidates by name, email, skills, location, job, tags,
experience, and application status — including combinations thereof. A dedicated search
engine (Elasticsearch/OpenSearch) adds real operational cost and complexity.

## Decision

Start with **PostgreSQL** search/filtering capabilities (ILIKE, full-text search, JSONB,
indexes) for candidate search and combined filtering. Introduce a **dedicated search engine
only if a concrete requirement justifies it** (e.g. measured latency targets or complex
relevance ranking that PostgreSQL cannot meet).

## Consequences

- **Positive:** no extra service; transactional consistency with the DB; simpler ops.
- **Negative/trade-off:** PostgreSQL search may be less powerful for advanced relevance or
  at very large scale; revisit against search < ~1s latency target as data grows.
- Key performance target: search under ~1 second for normal workloads.
