<!--
  Sync Impact Report (v0.1.0 -> v1.0.0)
  - Version change: 0.1.0 (template placeholder) -> 1.0.0 (initial ratified RecruitFlow constitution)
  - Modified principles: none renamed (authorship of all new content)
  - Added: 6 Core Principles; Security & Data Protection section; Development Workflow & Quality Gates section; Governance
  - Removed: none (placeholder template superseded)
  - Follow-up TODOs: RATIFICATION_DATE set to 2026-08-28 (install/authoring date); update LAST_AMENDED_DATE on future amendments
-->

# RecruitFlow Constitution

## Core Principles

### I. Strict Tenant Isolation (MUST, NON-NEGOTIABLE)

Every data access MUST be scoped to a single Organization. Organization A MUST NEVER read,
write, or observe Organization B's data — through the API, queries, exports, or background
jobs. Tenant scoping is enforced at the query/data-access layer, never left as a per-endpoint
afterthought. Any code path that could leak data across tenants is a CRITICAL defect and must
be treated as such. Rationale: RecruitFlow holds sensitive candidate data; a cross-tenant
leak is the single most serious failure mode.

### II. Modular Monolith (MUST)

RecruitFlow starts as a **Modular Monolith** with clear module boundaries (identity,
organizations, candidates, jobs, applications, interviews, documents, communications,
notifications, analytics, search, ai, audit). Do NOT start with microservices. Architectural
complexity (services, distributed systems) MUST be justified by a demonstrated, current need —
not by hypothetical scale. Modules may be extracted into services later if a real need emerges.
Rationale: preserves flexibility and clean boundaries without premature distributed complexity.

### III. Specification-Driven Development (MUST)

All work follows the Spec Kit workflow — Constitution → Specification → Clarification →
Technical Plan → Tasks → Analysis → Implementation → Testing → Review. Do NOT implement
features that are not part of an approved specification. Requirements, plan, tasks, and
implementation MUST remain consistent. Human review is required between major phases. When a
requirement is ambiguous and could affect architecture or data modeling, STOP and ask.
Rationale: prevents drift and unapproved scope, and produces a reviewable, portfolio-grade
trajectory.

### IV. Simplicity & Explainability (MUST)

Prefer the simplest solution that satisfies the requirement. Avoid unnecessary microservices,
unnecessary infrastructure, unnecessary abstractions, and premature optimization. Every
non-trivial technology choice MUST have a documented reason and trade-offs (an ADR under
`docs/decisions/` when architectural). Do NOT add technology "to look impressive."
Rationale: simple, explainable systems are maintainable, testable, and defensible.

### V. Security-First for Sensitive Candidate Data (MUST)

RecruitFlow handles sensitive candidate and hiring data. Follow OWASP practices. Required:
HTTPS, secure password hashing, robust authentication and authorization, input validation,
secure file-upload validation, signed/private file URLs, rate limiting, audit logging, and
secure secret management. Never commit secrets. Rationale: candidate privacy and trust are
core to the product's viability.

### VI. AI as Decision Support Only (MUST)

Any AI capability (e.g. CV extraction, candidate–job matching) is **decision support only**.
It MUST NOT autonomously reject candidates, make final hiring decisions, or act without
human review. AI output MUST be explainable and human-reviewable. Rationale: hiring decisions
are consequential and must remain under human control.

## Security & Data Protection

- Database: **PostgreSQL** is the database across all environments (dev and production).
- File content lives in S3-compatible object storage (MinIO locally); metadata lives in
  PostgreSQL. File access uses signed/private URLs.
- Redis is used only where it provides a genuine benefit (caching, rate limiting, background
  jobs, temporary state) and never as a replacement for durable relational data.
- Important operations (notifications, emails, imports, background jobs, state transitions)
  are designed to be idempotent where appropriate.
- Background/AI worker failure MUST NOT take down core RecruitFlow.

## Development Workflow & Quality Gates

- Follow the preferred stack: Django + DRF backend, React + Vite + TS frontend, PostgreSQL.
  Introduce future-only technologies (Kafka, OpenSearch, pgvector, WebSockets, K8s, Prometheus,
  Grafana, OpenTelemetry) only when a concrete requirement justifies them.
- Automated tests are expected (pytest / pytest-django on the backend), following the strategy
  defined in the relevant spec/plan. Run relevant tests after implementation and report failures
  rather than hiding them.
- Keep the specification, plan, tasks, README, and AGENTS.md consistent with the implementation.
- Target engineering metrics (measure, not guarantee): API p95 < ~500ms; search < ~1s;
  dashboard < ~2s.

## Governance

This constitution supersedes all other project practices and is **non-negotiable** within
specification, planning, analysis, and implementation. If a principle itself needs to change,
that must occur through an explicit amendment of this document — not by silently diluting or
reinterpreting a principle in downstream artifacts.

- **Amendments** require: a documented change to this file, a semantic version bump, and a brief
  rationale/impact note (see Sync Impact Report practice used by `/speckit.constitution`).
- **Versioning**: MAJOR for backward-incompatible principle removals/redefinitions; MINOR for
  new principles/sections or materially expanded guidance; PATCH for clarifications/wording.
- **Compliance**: All specs, plans, tasks, and PRs/reviews MUST verify compliance with this
  constitution. Complexity MUST be justified. `AGENTS.md` is the runtime development guidance
  referenced from here.

**Version**: 1.0.0 | **Ratified**: 2026-08-28 | **Last Amended**: 2026-08-28
