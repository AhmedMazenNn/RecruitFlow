# Feature Specification: Organizations & Multi-Tenancy

**Feature Branch**: `feature/004-organizations-multi-tenancy`

**Created**: 2026-08-29

**Status**: Approved (design agreed with user in brainstorming)

**Input**: Brainstormed design session — "Which feature next?" → Organizations & Multi-Tenancy, backend foundation only. Design decisions confirmed with the user: one organization per user, org auto-created at registration, admin scoped to own org, tenant middleware + explicit queryset scoping, superusers bypass scoping, `seed_demo` uses one shared demo org.

## Context

RecruitFlow is a multi-tenant recruitment SaaS. The project constitution requires that **Organization A MUST NEVER access Organization B's data**. Today that is unenforceable: the `User` model has no organization association and no domain models exist yet. Every future model (Jobs, Candidates, Applications, Interviews) belongs to some company, so the tenant foundation must exist before those features are built.

## Scope

- New `apps/organizations/` module: `Organization` model + org endpoints (`me`, `me` PATCH, `me/members`).
- New `apps/core/` module: shared `TenantMiddleware` + `ScopedQuerysetMixin`.
- `User.organization` FK; backfill migration assigns every existing user an organization.
- Registration auto-creates an organization and assigns the new recruiter to it.
- `UserViewSet` becomes org-scoped (admins manage only their own org's users). Superusers bypass.
- `seed_demo`: both demo users share one `RecruitFlow Demo` organization.
- Backend foundation only. Frontend "Coming soon" org settings/team pages stay as-is; UI wiring is a later feature.

## User Scenarios & Testing

User stories are ordered by value. Each is independently testable.

### User Story 1 - Create an organization at signup (Priority: P1)

A new recruiter who registers gets their own organization immediately, so their data is tenant-isolated from the start.

**Why this priority**: Tenant isolation is the foundation of the platform; without an org on every user, no domain feature can be built correctly.

**Independent Test**: `POST /api/auth/register/` with an optional `organization_name` creates the user, an Organization, and links them (response includes `organization`). A user registering with no org name gets the default `My Organization`.

**Acceptance Scenarios**:

1. **Given** no organization with name "Acme", **When** a new user registers with `organization_name: "Acme"`, **Then** an Organization "Acme" is created and the user's `organization` is that org.
2. **Given** a new user registering without `organization_name`, **When** the request completes, **Then** the user belongs to a default-named org (`My Organization`).
3. **Given** two users registering with the same `organization_name`, **When** both requests complete, **Then** they belong to the **same** Organization (get-or-create by name).
4. **Given** a registered recruiter, **When** `GET /api/auth/users/me/` is called, **Then** the response includes their `organization` (id + name).

### User Story 2 - Read and update own organization (Priority: P1)

A member can read their organization; an org admin can rename it.

**Why this priority**: Basic org self-service is the surface of the new module and exercises the tenant-scoped query path end to end.

**Independent Test**: `GET /api/organizations/me/` returns the caller's org; `PATCH /api/organizations/me/` updates the name for the org admin and returns 403/404 for others.

**Acceptance Scenarios**:

1. **Given** an authenticated member, **When** they call `GET /api/organizations/me/`, **Then** they receive their org object (id, name, created_at).
2. **Given** an org admin, **When** they `PATCH /api/organizations/me/` with a new `name`, **Then** 200 with the updated org; the change persists.
3. **Given** a non-admin member of the org, **When** they `PATCH /api/organizations/me/`, **Then** 403.
4. **Given** a user who is not a member (no org), **When** they call `me`, **Then** 404.

### User Story 3 - Admins manage only their own org's users (Priority: P1)

User management (list, role change, toggle active) is bounded to the caller's organization — the concrete expression of tenant isolation.

**Why this priority**: This is the rule that prevents Org A from ever touching Org B's data.

**Independent Test**: An admin of Org A sees only Org A's users via `GET /api/auth/users/`; attempting to `PATCH /api/auth/users/{id}/role/` or `toggle_active` on an Org B user returns 404; a superuser can see all users.

**Acceptance Scenarios**:

1. **Given** an org admin of Org A, **When** they list `/api/auth/users/`, **Then** only Org A users are returned (including themselves).
2. **Given** an org admin of Org A and a user in Org B, **When** they call `PATCH .../users/{b_id}/role/` or `.../toggle_active/`, **Then** 404 (not found — org B user is invisible).
3. **Given** a superuser, **When** they list users or act on any user, **Then** all users are visible/actionable (bypass).
4. **Given** a recruiter (non-admin), **When** they list `/api/auth/users/`, **Then** they still see their org's users (existing list behavior preserved within org).

### User Story 4 - seed_demo creates a shared demo org (Priority: P2)

The demo dataset is internally consistent: both demo users share one organization so the admin demo user can manage the recruiter demo user.

**Why this priority**: Keeps the demo story realistic and matches the in-app admin page scope.

**Independent Test**: After `seed_demo`, both `admin@recruitflow.dev` and `recruiter@recruitflow.dev` have the same `organization`; a second run adds none.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** `seed_demo` runs, **Then** exactly two demo users exist under one `RecruitFlow Demo` org.
2. **Given** the command already ran, **When** it runs again, **Then** no duplicates (created/skipped summary unchanged).
3. **Given** existing users with no org, **When** `migrate` runs, **Then** every existing user belongs to an organization (no orphaned users).

### Edge Cases

- A user whose org row is missing (should not happen post-backfill) → org endpoints return 404.
- Registration org name that is only whitespace → treated as blank → default name.
- Two orgs with the same case-insensitive name — decided: match on exact name (no unique constraint this pass; duplicates are possible but harmless since get-or-create matches exact names). Supersede note: a unique org-name restriction may come with the org settings UI.
- Superuser with no org → `me` endpoint 404 but full bypass everywhere else.

## Requirements

### Functional Requirements

- **FR-001**: `User.organization` MUST be a nullable FK initially (bridge period) and non-null on a fresh DB; every user MUST end up in exactly one org after the backfill migration.
- **FR-002**: `POST /api/auth/register/` MUST accept optional `organization_name`, create the org (get-or-create by name, default `My Organization`), assign the new recruiter to it, and keep the recruiter-only role rule.
- **FR-003**: A `TenantMiddleware` MUST set `request.organization` from the authenticated user for authenticated requests.
- **FR-004**: Org-owned ViewSets MUST scope their queryset to `request.organization` via the shared `ScopedQuerysetMixin`; `UserViewSet.get_queryset()` MUST be org-scoped.
- **FR-005**: `is_superuser` users MUST bypass tenant scoping (standard Django privilege).
- **FR-006**: `GET /api/organizations/me/` and `PATCH /api/organizations/me/` MUST operate on the caller's organization (PATCH admin-of-org only); `GET /api/organizations/me/members/` MUST list the org's users (admin-of-org only).
- **FR-007**: Cross-org access MUST return 404 (not 403) so the existence of other orgs' data is not leaked.
- **FR-008**: `seed_demo` MUST create a shared `RecruitFlow Demo` organization for both demo users and stay idempotent.

### Key Entities

- **Organization**: A tenant/company. Attributes: `name`, `created_at`, `updated_at`. Currently the only tenant-scoped module consumer is `User.organization`; future domain models reference it.
- **User (extended)**: Gains `organization` FK → Organization. Roles unchanged (admin/recruiter).

## Success Criteria

- **SC-001**: Backend pytest suite green (existing 27 + new isolation/org tests); `manage.py check` clean; `makemigrations --check` clean.
- **SC-002**: `migrate` against local PostgreSQL leaves every existing user in an org (backfill produces 0 orphans).
- **SC-003**: Isolation tested directly: Org A admin gets 404 on Org B user endpoints; superuser bypass verified.
- **SC-004**: `seed_demo` twice → two demo users under one demo org, idempotent.
- **SC-005**: No new runtime dependencies; no frontend changes in this feature pass.

## Assumptions

- Single deployment, single PostgreSQL DB — per ADR-001/002 modular monolith.
- Users belong to exactly one organization; multi-org membership is out of scope (future).
- Tenant isolation lives in shared middleware + mixin rather than schema-per-tenant (decision recorded in ADR-008).
- Org uniqueness by exact name is acceptable for now; uniqueness constraints deferred to the org-settings UI feature.
- Frontend untouched this pass — org/team UI wiring is a separate future feature.