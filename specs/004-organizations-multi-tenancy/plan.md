# Plan: Organizations & Multi-Tenancy

**Input**: `specs/004-organizations-multi-tenancy/spec.md` (approved).

New work: `apps/organizations/` (tenant model + endpoints) and `apps/core/` (shared tenant middleware + scoping mixin); `User.organization` FK; registration + `UserViewSet` scoping; `seed_demo` shared demo org.

## Decisions

- **Data model**: `Organization(name, created_at, updated_at)`; `User.organization` nullable FK (bridge-only nullable; non-null guaranteed post-backfill on fresh DBs).
- **Registration**: optional `organization_name` → get-or-create org (default `My Organization`), assign recruiter to it, keep recruiter-only role.
- **Isolation (ADR-008)**: `TenantMiddleware` sets `request.organization`; `ScopedQuerysetMixin` scopes org-owned ViewSets; `UserViewSet` org-scoped; superusers bypass; cross-org → 404.
- **Endpoints**: `GET/PATCH /api/organizations/me/`, `GET /api/organizations/me/members/` (admin-of-org). User payloads gain nested `organization`.
- **Backfill**: data migration assigns each existing user their own org (name from `My Organization`), so 0 orphans.
- **seed_demo**: both demo users share one `RecruitFlow Demo` org.

## What changes (by file)

**Backend**
- `apps/core/` — `TenantMiddleware`, `ScopedQuerysetMixin` (new app, registered in INSTALLED_APPS).
- `apps/organizations/` — `Organization` model, serializer, viewset/endpoints, urls (new app).
- `apps/authentication/models.py` — `User.organization` FK; migration 0005 (backfill + AlterField).
- `apps/authentication/serializers.py` — register `organization_name`; nested `organization` on UserSerializer; create-with-org.
- `apps/authentication/views.py` — `UserViewSet` org-scoped via mixin; superuser bypass.
- `config/settings/...` — add `core` + `organizations` to INSTALLED_APPS; add middleware.
- `config/urls.py` — include `organizations` routes.
- `apps/authentication/management/commands/seed_demo.py` — shared demo org.
- tests: `apps/organizations/tests/` (org + isolation), updates to auth tests.

**Frontend**
- None this pass (backend foundation only).

**Docs**
- `docs/decisions/008-tenant-isolation.md` (written).
- `AGENTS.md` — current-state + module notes.
- `README.md` — API list (org endpoints), model note only if warranted.

## Verification

1. Backend: full `pytest` (27 existing + new), `manage.py check`, `makemigrations --check --dry-run`.
2. `migrate` on local PostgreSQL → every existing user in an org (0 orphans).
3. `seed_demo` twice → 2 demo users under one `RecruitFlow Demo` org, idempotent.
4. API smoke: register-with-org (me shows org), `users/` scoped per org, cross-org role PATCH → 404, superuser bypass, `org/me` PATCH admin-only.
5. Frontend untouched: builds unaffected (no frontend changes).