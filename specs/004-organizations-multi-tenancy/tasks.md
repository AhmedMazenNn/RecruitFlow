# Tasks: Organizations & Multi-Tenancy

**Input**: `specs/004-organizations-multi-tenancy/` (spec + plan, approved).

**Tests**: Backend pytest (TDD where noted); gates `manage.py check` + `makemigrations --check`. No frontend changes this pass.

**Ordering**: Core/organizations apps scaffold + tests-first, then model migration + backfill, then registration + scoping, then seed, docs, final verify.

## Implementation

- [x] T001 Write expected tests: new `apps/organizations/tests/` — organizations endpoints (me, me PATCH admin/non-admin, members list) in `test_organizations.py`, and isolation tests (org-scoped user list, cross-org 404, superuser bypass) in `test_isolation.py`. Also update auth tests: registration-with-org in `test_register.py`, `me` includes org in `test_users.py`, scoped fixtures in `test_admin_management.py`. Written and watched fail first (TDD slices), then implemented to green.
- [x] T002 Create `apps/core/` with `TenantMiddleware` (sets `request.organization`) and `ScopedQuerysetMixin` (scopes org-owned ViewSets; superuser bypass). Register app + add middleware to `MIDDLEWARE`.
- [x] T003 Create `apps/organizations/` with `Organization(name, created_at, updated_at)`, `OrganizationSerializer`, org viewset/endpoints (`me`, `me` PATCH, `me/members`), `urls.py`. Register app + wire under `/api/organizations/`.
- [x] T004 Add `User.organization` FK + migration 0005; author backfill data migration assigning each existing user an org (0 orphans). `makemigrations --check` clean.
- [x] T005 Update `RegisterSerializer` — optional `organization_name`, get-or-create org (default `My Organization`), assign user; add nested `organization` to `UserSerializer` output.
- [x] T006 Scope `UserViewSet` via `ScopedQuerysetMixin`; keep `me/me_partial/change_password` self-endpoints unscoped; `is_superuser` bypass verified in tests. `request.organization` populated by `TenantMiddleware`.
- [x] T007 Update `seed_demo.py` — both demo users under one shared `RecruitFlow Demo` org (reassign on rerun); keep idempotency + superuser promotion.
- [x] T008 Backend verify: `migrate` on local PostgreSQL (6 users → 0 orphans), `seed_demo` twice (idempotent, shared org), full pytest green (53), `manage.py check`, `makemigrations --check`.
- [x] T009 API smoke — covered by the automated isolation suite (register-with-org → `me` shows org; `users/` scoped; cross-org → 404; superuser bypass; org PATCH admin-only).
- [x] T010 Reconcile docs: `AGENTS.md` (module structure, repo state, tenant-isolation rule now enforced), `README.md` (API list: org endpoints, register `organization_name`), ADR-008 wording (middleware resolves the JWT).
- [ ] T011 Final verification: full backend pytest + `manage.py check` + `makemigrations --check`; confirm no frontend/files changed; compose commits (ADR/specs, apps, model+migration, registration+scoping, seed, tests, docs) and commit on the feature branch.

## Notes

- Org uniqueness by exact name (get-or-create) is deliberate this pass; uniqueness constraints deferred to the org-settings UI feature.
- Cross-org access is 404 (never 403) to avoid leaking other orgs' data existence.
- Superuser bypass is the documented escape hatch (Ops/admin). Verify it in tests.
- No new runtime dependencies; frontend is untouched.
- Demo/seeded orgs are fixtures, not secrets.
- **Deviation (agreed with user)**: FR-001's literal "non-null on a fresh DB" was NOT implemented — `User.organization` stays nullable (`null=True`, `on_delete=SET_NULL`) so the spec's "no org → 404" behavior remains real and testable. App logic (registration, seed, backfill) guarantees orgs in practice.
- **Deviation**: tasks were executed as tight TDD red-green slices (tests → middleware/endpoints → FK → serializers → scoping → seed) instead of one big test-file-first pass, because isolation tests need the `Organization` model to exist first.