# Tasks: Auth UI Redesign, Coming-Soon Sweep, Demo Seed & Admin Page

**Input**: Design documents from `/specs/002-auth-ui-admin-seed/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), contracts/api.md

**Tests**: Backend tests included (Constitution / testing expectations). Frontend gates are `npm run build` + `npm run lint` (0 errors; no runner installed).

**Organization**: Tasks grouped by user story; each story is independently implementable and testable. US1–US3 were clarified with the user (full coming-soon sweep; auth redesign; idempotent `seed_demo`; admin page managing users + roles).

## Legend

- **[P]**: can run in parallel (different files, no dependencies)
- **[Story]**: user story this task belongs to (US1–US4)

---

## Phase 1: Setup & Baseline

**Purpose**: Confirm a green baseline before edits so failures are attributable to this feature.

- [x] T001 Baseline gates before editing: `backend/.venv/bin/pytest -q` (expect 19 passed), `python manage.py check`, `frontend` `npm run build` + `npm run lint` (expect 0 errors)

---

## Phase 2: User Story 1 - Redesigned sign-in & sign-up pages (Priority: P1) 🎯 MVP

**Goal**: Modern Login/Register pages consistent with the workspace design system (tokens, UI primitives, motion); no external network images.

**Independent Test**: `npm run build` + `npm run lint` 0 errors; both pages render in both themes on desktop + mobile; sign-in and create-account flows still work; no `pravatar.cc`/external image URLs in `frontend/src/pages/auth/`.

### Implementation for User Story 1

- [x] T002 [US1] Create shared split-screen layout `frontend/src/components/auth/AuthShell.tsx` (form slot left, brand panel right using design tokens — `bg-canvas`, `bg-surface`, `bg-elevated`, `text-ink*`, `border-border`, `bg-brand` — with `framer-motion` entrance; `components/brand/Logo`; hidden on `lg:` screens)
- [x] T003 [US1] Rewrite `frontend/src/pages/auth/Login.tsx` on design primitives (`components/ui/{Button,Input,Field,Alert}`, `components/brand/Logo`) via AuthShell; keep API flow (`login(email,password)` → navigate `/`); add password visibility toggle; render error via `Alert`
- [x] T004 [P] [US1] Rewrite `frontend/src/pages/auth/Register.tsx` on design primitives via AuthShell; 2-column name grid, show/hide password + confirm, client-side match check, backend error extraction (email/password/detail); `register(form)` → navigate `/login`
- [x] T005 [US1] Verify gates: `npm run build` + `npm run lint` (0 errors); confirm both themes render and no external image URLs remain in `frontend/src/pages/auth/`

**Checkpoint**: US1 complete and demo-able.

---

## Phase 3: User Story 2 - Remove mock data; "Coming soon" placeholders (Priority: P1)

**Goal**: Delete `frontend/src/data/` and replace every backend-less page/tab with a styled placeholder; keep auth, Settings account tab, and (from US4) admin functional.

**Independent Test**: `frontend/src/data/` deleted and zero `data/` imports remain in `src/` (grep); all listed pages/tabs render the placeholder; `npm run build` + `npm run lint` 0 errors.

### Implementation for User Story 2

- [x] T006 [P] [US2] Create placeholder primitive `frontend/src/components/ui/ComingSoon.tsx` (Panel-based: icon, title, optional description; consistent tokens)
- [x] T007 [P] [US2] Rewrite `frontend/src/pages/Dashboard.tsx`: keep greeting header (first name), drop mock action buttons + `useUi()`/`open`, body → `<ComingSoon />`
- [x] T008 [P] [US2] Replace bodies with `<ComingSoon />` in `frontend/src/pages/Jobs.tsx` and `frontend/src/pages/JobDetails.tsx` (remove `data/` imports and `useUi` usage)
- [x] T009 [P] [US2] Replace bodies with `<ComingSoon />` in `frontend/src/pages/Candidates.tsx` and `frontend/src/pages/CandidateProfile.tsx` (remove `data/` imports and `useUi` usage)
- [x] T010 [P] [US2] Replace bodies with `<ComingSoon />` in `frontend/src/pages/Pipeline.tsx`, `frontend/src/pages/Interviews.tsx`, `frontend/src/pages/InterviewFeedback.tsx`
- [x] T011 [P] [US2] Replace bodies with `<ComingSoon />` in `frontend/src/pages/Analytics.tsx` and `frontend/src/pages/Notifications.tsx`
- [x] T012 [P] [US2] Convert Settings non-account tabs to `<ComingSoon />` wrappers (keep component signatures so `pages/Settings.tsx` tab switch still works): `frontend/src/components/settings/OrganizationProfile.tsx`, `TeamMembers.tsx`, `RolesPermissions.tsx`, `PipelineConfig.tsx` — the account tab (`components/settings/AccountPanel.tsx`) stays untouched
- [x] T013 [P] [US2] Convert mock-driven modals to `<ComingSoon />` shells (remove `data/`+team imports): `frontend/src/components/candidates/AddCandidateModal.tsx`, `frontend/src/components/jobs/CreateJobModal.tsx`, `frontend/src/components/interviews/ScheduleInterviewModal.tsx`
- [x] T014 [P] [US2] Fix retained layout/UI that imported mock data: `components/ui/StatusBadge.tsx` (inline stage-label map), `components/layout/Sidebar.tsx` (drop unread-badge `data/` import), `components/layout/WorkspaceSwitcher.tsx` (static "RecruitFlow", no `data/`), `components/notifications/NotificationBell.tsx` (no fake badge/`data/` import)
- [x] T015 [US2] Delete mock data + now-unused domain components (verify no imports after T007–T014): `frontend/src/data/` (activity.ts, analytics.ts, candidates.ts, interviews.ts, jobs.ts, stages.ts), `frontend/src/components/dashboard/`, `frontend/src/components/analytics/`, `frontend/src/components/pipeline/`
- [x] T016 [US2] Verify: grep `src/` for `data/(activity|analytics|candidates|interviews|jobs|stages)` returns nothing; `npm run build` + `npm run lint` (0 errors)

**Checkpoint**: fabricated data gone; app navigable with placeholders.

---

## Phase 4: User Story 3 - `seed_demo` command (Priority: P2)

**Goal**: Idempotent Django management command creating one demo user per role with documented credentials; promotes existing superusers to `admin`.

**Independent Test**: `python manage.py seed_demo` creates the expected users; re-running adds none (idempotent); `manage.py check` passes.

### Tests for User Story 3 (TDD — write first, expect fail) ⚠️

- [x] T017 [US3] Write `backend/apps/authentication/tests/test_seed_demo.py`: creates one user per role with email/password; second run adds no users; existing superuser role promoted to `admin`

### Implementation for User Story 3

- [x] T018 [US3] Create `backend/apps/authentication/management/__init__.py` + `management/commands/__init__.py` + `management/commands/seed_demo.py` (`BaseCommand`; `get_or_create` per `DEMO_USERS` table with `DEMO_PASSWORD="Demo@123"`; promote superusers to role `admin`; `self.style` created/skipped summary)
- [x] T019 [US3] Document command + demo credentials in root `README.md` (Backend section)
- [x] T020 [US3] Verify: run `backend/.venv/bin/python manage.py seed_demo` twice against local PostgreSQL (no duplicates), `manage.py check`, filtered pytest

**Checkpoint**: US3 complete; real users available for US4 demo.

---

## Phase 5: User Story 4 - Admin-only user management page (Priority: P2)

**Goal**: Admin-only `/admin` page listing users (name, email, role, status, created) with activate/deactivate and change-role actions, enforced server-side.

**Independent Test**: Admin (role `admin` or superuser) sees Admin nav + page; non-admin is redirected from `/admin`; list loads from API; toggle-active and role change persist; non-admin `PATCH .../role/` → 403.

### Tests for User Story 4 (TDD — write first, expect fail) ⚠️

- [x] T021 [P] [US4] Write `backend/apps/authentication/tests/test_admin_management.py`: admin changes role → 200 + persisted; non-admin → 403; invalid role → 400; superuser passes `IsAdmin`

### Backend Implementation for User Story 4

- [x] T022 [US4] Broaden `IsAdmin` in `backend/apps/authentication/permissions.py` to also grant when `request.user.is_superuser`
- [x] T023 [US4] Add read-only `is_superuser` to `UserSerializer` and new `ChangeUserRoleSerializer` (required `role` ChoiceField over `User.Role`) in `backend/apps/authentication/serializers.py`
- [x] T024 [US4] Add `@action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsAdmin], url_path="role")` `update_role` to `UserViewSet` in `backend/apps/authentication/views.py` (validates + saves role, returns serialized user; watch `get_permissions` so the action keeps `IsAdmin`)
- [x] T025 [US4] Backend verify: run `test_admin_management.py` (green) then full `pytest` (expect 19 + new, all green) + `manage.py check`

### Frontend Implementation for User Story 4

- [x] T026 [P] [US4] Extend `User` interface with `is_superuser?: boolean` + add derived `isAdmin` (`role === 'admin' || !!is_superuser`) to the context value in `frontend/src/contexts/AuthContext.tsx`
- [x] T027 [P] [US4] Add admin-only nav item ("Admin", `ShieldIcon`) to the bottom section of `frontend/src/components/layout/Sidebar.tsx`, rendered only when `isAdmin`
- [x] T028 [US4] Add `AdminRoute` (extends protected logic; redirects non-admin to `/`) + `/admin` route in `frontend/src/App.tsx`
- [x] T029 [US4] Create `frontend/src/pages/admin/AdminUsers.tsx` + `frontend/src/components/admin/UsersTable.tsx`: paginated `GET /api/auth/users/` (avatar, name, email, role `Badge`, active `StatusBadge`, created date, `Pagination`), loading `Skeleton`, error `Alert`, actions: toggle active (`PATCH {id}/toggle_active/` with `ConfirmDialog`) and role `Select` → `PATCH {id}/role/`; sonner toasts; refetch on mutation
- [x] T030 [US4] Frontend verify: `npm run build` + `npm run lint` (0 errors); manual loop as admin (list → toggle → change role) and a non-admin redirect check

**Checkpoint**: US4 complete; admin page functional end-to-end.

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: Docs consistency + final verification + integration decision.

- [ ] T031 [P] Reconcile docs after all stories: `AGENTS.md` "Current Repository State" (auth redesign, mock data removed, seed command, admin page, `is_admin` rule)
- [ ] T032 Full verification: backend `pytest` + `manage.py check` + `makemigrations --check`; frontend `npm run build` + `npm run lint` (0 errors); manual smoke: auth redesign both themes, coming-soon pages, `seed_demo` idempotency, admin page loop
- [ ] T033 Push / open PR for `feature/auth` (includes pending sprint-1 auth work) — **human decision**

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (T001) → all (guards the baseline).
- US1 phase: T002 (AuthShell) must precede T003/T004; T005 after.
- US2 phase: T006 before its consumers (T007–T013); T014 independent; T015 after T007–T014; T016 last.
- US3 phase: T017 (failing tests) before T018; T019/T020 after T018.
- US4 phase: T021 (failing tests) before T022–T024; T025 after; frontend T026–T029 after backend green (or parallel-safe since separate files, but the UI needs the API to exist to test); T030 last.
- Polish (T031–T033) after all stories.

### Parallel Opportunities

- T003 || T004 (different pages, both after T002)
- T006–T014 all touch distinct files → parallel
- T017 (US3 tests) || T021 (US4 tests) || T026 || T027 (all distinct files)
- T026 || T027 (AuthContext + Sidebar) can be parallel
- T031 runs parallel to frontend work once backend is stable

### Within Each User Story

- Tests (where included) written and failing before implementation; then implementation; then independent verification.

---

## Parallel Example: User Story 2

```bash
Task: T006 Create components/ui/ComingSoon.tsx
Task: T012 Convert Settings non-account tabs (OrganizationProfile, TeamMembers, RolesPermissions, PipelineConfig) to ComingSoon wrappers
Task: T014 Fix StatusBadge / Sidebar / WorkspaceSwitcher / NotificationBell (inline or drop data/ imports)
# after the above and T007–T013:
Task: T015 Delete frontend/src/data/ + unused dashboard/analytics/pipeline components
Task: T016 Grep-verify no data/ imports + build/lint gates
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001 baseline → 2. T002 → T003/T004 → T005 → **STOP + validate** the redesigned auth pages (build/lint, both themes, flows work).

### Incremental Delivery

1. Setup → US1 auth redesign → validate (MVP).
2. Add US2 coming-soon sweep → validate (fabricated data gone, build/lint green).
3. Add US3 `seed_demo` → validate (idempotent, real users).
4. Add US4 admin page → validate (backend 403s, admin UI loop).
5. Polish: docs + full gates + human review.

### Parallel Team Strategy

Two devs: A = US1 (auth pages), B = US2 (sweep). After B: A moves to US3 while B waits on US4 backend (tests/perm/serializer/view), then B builds the admin UI.

## Notes

- Do not regress approved auth behavior (recruiter-only registration, read-only role/email self-service, logout blacklist) — the 19 existing tests guard this.
- Frontend gates = `npm run build` + `npm run lint` (0 errors).
- Commit after each logical group; stop at checkpoints.
- Never commit secrets; seeded credentials are documented demo credentials.