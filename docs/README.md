# RecruitFlow Documentation

Documentation index for the RecruitFlow project. For high-level project context
(product vision, architecture, workflow), see [`AGENTS.md`](../AGENTS.md).

## Contents

| Document | Purpose |
|----------|---------|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Git workflow, branching model, commit conventions, PRs, Definition of Done. |
| [`decisions/`](decisions/) | Architecture Decision Records (ADRs) for major technical choices. |

## Architecture Decision Records

| ADR | Title | Status |
|-----|-------|--------|
| [001](decisions/001-modular-monolith.md) | Modular Monolith Architecture | Accepted |
| [002](decisions/002-postgresql.md) | PostgreSQL as the Database Across All Environments | Accepted |
| [003](decisions/003-redis.md) | Redis Usage Boundaries | Accepted |
| [004](decisions/004-background-processing.md) | Background Processing with Celery | Accepted |
| [005](decisions/005-object-storage.md) | S3-Compatible Object Storage for Files | Accepted |
| [006](decisions/006-search-strategy.md) | Search Strategy — PostgreSQL First | Accepted |
| [007](decisions/007-ai-matching.md) | AI Capabilities as Decision Support Only | Accepted |

> Architecture diagrams (system, DB/domain, auth flow, candidate/application workflow,
> CV processing, notification architecture, AI matching, deployment) are planned
> deliverables and will be added here as they are produced.
