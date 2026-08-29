# ADR-008: Tenant Isolation via Middleware and Explicit Scoping

**Status:** Accepted
**Date:** 2026-08-29

## Context

RecruitFlow is a multi-tenant recruitment SaaS. The constitution mandates that
Organization A MUST NEVER access Organization B's data. Until now the `User` model had no
organization association, so isolation was unenforceable. The Organizations feature must
define HOW isolation is enforced for every present and future org-owned module (jobs,
candidates, applications, interviews, ...).

Candidates: (a) middleware + explicit queryset scoping; (b) schema-per-tenant via
`django-tenants`; (c) auto-filtering base manager that silently scopes every `.objects`
query.

## Decision

Adopt **tenant middleware plus explicit queryset scoping**:

- A `TenantMiddleware` sets `request.organization` from the authenticated user. Because DRF
  authentication runs inside the view (so `request.user` is not yet populated at middleware
  time), the middleware resolves the bearer JWT itself via `JWTAuthentication` and sets
  `request.organization = user.organization`. Public/unauthenticated routes pass through
  unchanged (`request.organization = None`).
- A shared `ScopedQuerysetMixin` (in a new `apps/core` app) lets any org-owned ViewSet
  scope its queryset, e.g. filter by `request.organization`.
- `UserViewSet` becomes the first consumer; future module ViewSets use the same mixin.
- `is_superuser` bypasses scoping (standard Django privilege).
- Cross-org resource access returns **404** (not 403) to avoid leaking existence.

## Consequences

- **Positive:** transparent and testable scoping; works identically across all future
  module apps without restructuring the database; fits the modular-monolith direction
  (ADR-001); no new infrastructure.
- **Negative/trade-off:** relies on developers remembering to scope each org-owned
  queryset. Mitigated by the shared mixin, tenant tests, and code review. A future per-DB
  separation remains possible if scale demands it.
- No new runtime dependency is introduced.

## Alternatives considered

- **Schema-per-tenant (`django-tenants`):** rejected — heavyweight, restructures the whole
  DB, complicates migrations and local development, overkill for a single-postgres modular
  monolith.
- **Auto-filtering TenantManager:** rejected — implicit magic that fights Django's explicit
  queryset model, hard to debug, and eager queries outside a request context break.