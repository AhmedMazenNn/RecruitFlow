# ADR-004: Background Processing with Celery

**Status:** Accepted
**Date:** 2026-08-28

## Context

RecruitFlow will have long-running or asynchronous work: CSV candidate import for large
datasets, email/in-app notifications, and (future) AI/ML processing such as CV extraction
and candidate–job matching. Blocking the core request path for these is unacceptable.

## Decision

Use **Celery** (with Redis as the broker, per ADR-003) for background tasks. Design
background work so that a worker failure must **never** take down the core application
(e.g. an AI worker failing must not break core RecruitFlow).

## Consequences

- **Positive:** decouples slow work from request/response; enables retry/idempotency for
  important operations; isolates AI failures from the core app.
- **Negative/trade-off:** adds operational components (worker + broker); tasks must be
  made idempotent and observable.
- Key reliability rule: important operations (notifications, emails, imports, background
  jobs, state transitions) are idempotent where appropriate.
- Not yet introduced into the scaffold; added when a concrete async feature requires it.
