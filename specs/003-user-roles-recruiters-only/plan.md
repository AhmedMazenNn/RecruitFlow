# Plan: Recruiters-Only User Roles

**Input**: `specs/003-user-roles-recruiters-only/spec.md` (approved).

Source of truth: `backend/apps/authentication/` (auth) — no domain models changed. Candidate-as-data is untouched.

## Decisions

- `User.Role` → `ADMIN` + `RECRUITER`; `role` default `recruiter`.
- Migration `0004` (data first, then schema) converts `hiring_manager`/`candidate` → `recruiter`.
- `seed_demo` seeds `admin@recruitflow.dev` + `recruiter@recruitflow.dev`.
- `views.py` `get_queryset` collapses: with only admin/recruiter, return `User.objects.all()` for every authenticated user (existing list behavior preserved).
- Frontend: narrow `AuthContext.User.role` and `UsersTable` role options/tones to the two roles.

## What changes (by file)

**Backend**
- `apps/authentication/models.py` — Role choices + field default.
- `apps/authentication/migrations/0004_alter_user_role_and_migrate_legacy_roles.py` — RunPython data migration + AlterField.
- `apps/authentication/views.py` — simplify `get_queryset`.
- `apps/authentication/management/commands/seed_demo.py` — 2 demo users.
- `apps/authentication/tests/test_seed_demo.py`, `tests/test_admin_management.py` — updated expectations.

**Frontend**
- `frontend/src/contexts/AuthContext.tsx` — `role: 'admin' | 'recruiter'`.
- `frontend/src/components/admin/UsersTable.tsx` — 2 role options + tones.

**Docs**
- `AGENTS.md` — backend roles line + Target Users/authorization note (Admin + Recruiter for V1).
- `README.md` — seed table (2 users) + role references.
- `specs/002-user-roles...` → `specs/002-auth-ui-admin-seed/contracts/api.md` — role enum.

## Verification

1. Backend: updated `pytest` (full suite), `manage.py check`, `makemigrations --check --dry-run`.
2. `migrate` on local PostgreSQL → confirm `hiring.manager@…`/`candidate@…` now `recruiter`.
3. `seed_demo` twice → 2 demo users, idempotent; superuser promotion intact.
4. API smoke: `PATCH /role/` with `candidate` → 400; admin update to `recruiter` → 200; non-admin → 403.
5. Frontend: `npm run build` + `npm run lint` (0 errors).