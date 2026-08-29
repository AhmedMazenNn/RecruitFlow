# Implementation Plan: Auth UI Redesign, Coming-Soon Sweep, Demo Seed & Admin Page

**Branch**: `feature/auth` | **Date**: 2026-08-29 | **Spec**: `specs/002-auth-ui-admin-seed/spec.md`

**Input**: Feature specification from `/specs/002-auth-ui-admin-seed/spec.md`

## Summary

Four independent, sequentially deliverable slices on top of the completed auth foundation: (US1) redesign Login/Register with the design system and motion, (US2) delete `frontend/src/data/` and replace every backend-less page/tab with a "Coming soon" panel, (US3) add an idempotent `seed_demo` management command, (US4) add an admin-only users-management page backed by a small role-update endpoint. No new runtime dependencies on either side.

## Technical Context

**Language/Version**: Python 3.12 (Django 6.0.x, DRF 3.15+); TypeScript 5.5 (React 18.3, Vite 5)

**Primary Dependencies**: existing only — `lucide-react`, `framer-motion`, `sonner`, `tailwind-merge`, `@radix-ui/*` primitives already present in `components/ui/`; backend `django-extensions` (dev, present), no new packages.

**Storage**: unchanged (PostgreSQL dev DB, local `MEDIA_ROOT` for avatars).

**Testing**: backend pytest (19 existing tests must stay green; add tests for the role endpoint). Frontend: `npm run build` + `npm run lint` (0 errors) — no test runner.

**Target Platform**: Linux, dev servers (backend :8000, frontend :5173)

**Project Type**: Web application (Django + DRF backend, React/Vite frontend in a modular monolith monorepo)

**Performance Goals**: N/A — single-row user updates and lists are well under targets.

**Constraints**: NEVER commit secrets. Dev Database: local PostgreSQL. No new dependencies. Existing approved auth behavior must not regress (recruiter-only registration, read-only role/email in self-service, logout blacklist). Tenant isolation: user management is scoped to authenticated identity; all role/status mutations are single-user, admin-gated.

**Scale/Scope**: 4 user stories; no org model, no invite/create-user flow, no search in the admin table (future).

## Constitution Check

*GATE: Pass before Phase 0 research; re-check after design.*

- Modular monolith maintained — all new code inside `apps/authentication` and `frontend/src/`. PASS
- PostgreSQL for dev and prod — unchanged. PASS
- Spec-driven — spec, plan, tasks artifacts committed with the feature. PASS
- Never commit secrets — seeded credentials are documented demo passwords, not secrets; `.env` untouched. PASS
- No unnecessary technologies — nothing new added; motion/design tokens already installed. PASS
- No autonomous decisions on candidates/hiring — N/A. PASS

## Design Decisions

### US1 — Auth page redesign (P1)

- Rebuild `frontend/src/pages/auth/Login.tsx` and `frontend/src/pages/auth/Register.tsx` on the existing design-system primitives (`components/ui/Button`, `Input`, `Field`, `Alert`, `components/brand/Logo`) and Tailwind design tokens (`--rf-*` variables used across the workspace: `bg-canvas`, `bg-surface`, `bg-elevated`, `text-ink*`, `border-border`, `text-brand`, `bg-brand`), consistent with `AppShell`/user-facing pages.
- Keep the split-screen layout (form left, brand panel right, hidden on small screens). The right panel becomes an in-app brand treatment (design-token gradient + product/feature blurb), **no external image URLs** (`pravatar.cc` removed).
- Add motion: subtle `framer-motion` entrance/transition (already a dependency) reused from `AppShell`.
- Restore full password visibility toggle on the Login page too (Register has it) using the same `Eye/EyeOff` pattern found in Register.
- Forms keep current behavior and API calls (Login → `login(email,password)` then navigate `/`; Register → `register(form)` then navigate `/login`; client-side confirm-password check).
- Redirect logic stays under the existing `PublicRoute` guards in `frontend/src/App.tsx`.

### US2 — Coming-soon sweep + remove mock data (P1)

- New shared `frontend/src/components/ui/ComingSoon.tsx` (Panel-based placeholder: icon, "Coming soon", one-line description; optional `children`/`description` props).
- Replace the body of these pages with `<ComingSoon>` while keeping their route definitions and page shells (`PageHeader` where it exists) intact: `Dashboard.tsx` (keep the `Good morning, {name}` header + actions, body → ComingSoon), `Jobs.tsx`, `JobDetails.tsx`, `Candidates.tsx`, `CandidateProfile.tsx`, `Pipeline.tsx`, `Interviews.tsx`, `InterviewFeedback.tsx`, `Analytics.tsx`, `Notifications.tsx`.
- Settings: keep `Settings.tsx`'s account tab (`AccountPanel`) and `?tab=` init; swap the non-account tab components' bodies (`OrganizationProfile`, `TeamMembers`, `RolesPermissions`) for `<ComingSoon>` (keep the components as thin wrappers so the tab switch still works).
- Delete `frontend/src/data/` (activity.ts, analytics.ts, candidates.ts, interviews.ts, jobs.ts, stages.ts). Any now-unused imports/interfaces in the affected pages/components are removed in the same tasks (build + lint would otherwise fail on unused imports only if eslint flags them — they do under the current config, so prune them).
- No backend work — purely a presentation cleanup.

### US3 — `seed_demo` command (P2)

- New `backend/apps/authentication/management/__init__.py`, `management/commands/__init__.py`, `management/commands/seed_demo.py` — a `BaseCommand`:
  - `DEMO_USERS = [("admin@recruitflow.dev","Admin","User","admin"), ("recruiter@recruitflow.dev",...), ("hiring.manager@recruitflow.dev",..., "hiring_manager"), ("candidate@recruitflow.dev",..., "candidate")]`; shared password `Demo@123` (const `DEMO_PASSWORD`).
  - Idempotent via `User.objects.get_or_create(email=...)`, `update_or_create` semantics for name fields; `set_password` only on create.
  - Promotes existing superusers to `role=admin` (covers `createsuperuser` users).
  - Prints a created/skipped summary using `self.style`.
- Document in root `README.md` (Backend section): command + demo credentials table.

### US4 — Admin page + role endpoint (P2)

**Backend** (`backend/apps/authentication/`):
- Update `permissions.py` `IsAdmin` → also grant when `request.user.is_superuser` (so a stock superuser is admin).
- `serializers.py`: add read-only `is_superuser` to `UserSerializer`; add `ChangeUserRoleSerializer` (single required `role` ChoiceField validated against `User.Role`).
- `views.py` `UserViewSet`: new `@action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsAdmin], url_path="role") def update_role(...)` returning the serialized user (200). `get_permissions` untouched for existing actions.
- Tests (TDD) in `backend/apps/authentication/tests/test_admin_management.py`: admin updates a user's role (200, persisted); non-admin gets 403; invalid role gets 400; superuser passes IsAdmin. Then run full pytest (existing 19 must stay green — 19 + new tests).

**Frontend**:
- `contexts/AuthContext.tsx`: add optional `is_superuser?: boolean` to the `User` interface (serializer will return it); export helper `isAdmin = user.role === 'admin' || !!user.is_superuser` via the context value.
- `components/layout/Sidebar.tsx`: insert an `Admin` nav item (`ShieldIcon`) in the second (bottom) section shown **only** when `isAdmin`.
- `App.tsx`: add `AdminRoute` (extends ProtectedRoute, redirects to `/` when not admin) and route `/admin` → `pages/admin/AdminUsers.tsx`.
- New `frontend/src/pages/admin/AdminUsers.tsx` (page shell + `PageHeader`) and `frontend/src/components/admin/UsersTable.tsx`: fetch `GET /api/auth/users/` (paginated), render `Avatar` + name, email, role `Badge`, active `StatusBadge`, created date; pagination via existing `Pagination` primitive; actions: toggle active (`PATCH .../{id}/toggle_active/`, `ConfirmDialog`), change role (`Select` of the four roles → `PATCH .../{id}/role/`). Loading → `Skeleton`; errors → `Alert`; refetch on mutation. Sonner toasts for success/error.

## Project Structure

```text
specs/002-auth-ui-admin-seed/
├── plan.md              # This file
├── spec.md              # User stories US1–US4
├── contracts/api.md     # Role-update contract
└── tasks.md             # Phase 2 output

backend/apps/authentication/
├── management/commands/seed_demo.py   # US3 (new)
├── permissions.py                     # IsAdmin + superuser (US4)
├── serializers.py                     # is_superuser, ChangeUserRoleSerializer (US4)
├── views.py                           # update_role action (US4)
└── tests/test_admin_management.py     # US4 (new)

frontend/src/
├── pages/auth/Login.tsx               # US1 rewrite
├── pages/auth/Register.tsx            # US1 rewrite
├── components/ui/ComingSoon.tsx       # US2 (new)
├── pages/Dashboard.tsx … Notifications.tsx  # US2 → ComingSoon
├── components/settings/{OrganizationProfile,TeamMembers,RolesPermissions}.tsx  # US2 → ComingSoon wrappers
├── data/                              # US2 DELETED (activity, analytics, candidates, interviews, jobs, stages)
├── contexts/AuthContext.tsx           # US4 is_superuser + isAdmin
├── components/layout/Sidebar.tsx      # US4 Admin nav item
├── pages/admin/AdminUsers.tsx         # US4 (new)
├── components/admin/UsersTable.tsx    # US4 (new)
└── App.tsx                            # US4 AdminRoute + /admin route
```

## Sequence / Dependencies

1. US1 (auth redesign) — independent.
2. US2 (coming-soon sweep) — independent; keeps project buildable at every step.
3. US3 (seed_demo) — independent backend command.
4. US4 (admin page) — backend role endpoint first, then frontend (needs US3 users for a real demo).
5. Polish: docs reconcile (`README.md` seed docs included in US3; final full verification + review gate).

US1/US2/US3 can be parallelized (separate files). US4's backend is independent too; US4's frontend depends on the backend role endpoint and on US3 for demo data.