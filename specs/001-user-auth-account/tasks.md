# Tasks: User Authentication & Account

**Input**: Design documents from `/specs/001-user-auth-account/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.md

**Tests**: Explicitly requested by the user in the approved plan (Task E) and required by the Constitution / testing expectations — included.

**Organization**: Tasks are grouped by user story with shared infrastructure first.

## Legend

- **[P]**: can run in parallel (different files, no dependencies)
- **[Story]**: user story this task belongs to (US1–US4)

---

## Phase 1: Setup & Shared Infrastructure

**Purpose**: Dev database + auth plumbing required before any user story is complete.

- [P] [SH1] ⚠️ T001 **Run by the user**: create PostgreSQL role `recruitflow_user` (WITH LOGIN CREATEDB) + database `recruitflow`, set `DATABASE_PASSWORD` in `backend/.env` (see `quickstart.md#1`)
- [ ] [SH1] T002 Switch dev DB to PostgreSQL in `backend/config/settings/development.py` + add DB env defaults to `backend/config/settings/env_setup.py`
- [ ] [SH1] T003 Verify migration + serve: `python manage.py migrate` / `check`
- [ ] [US1] T004 Add `POST /api/auth/logout/` (LogoutView subclassing TokenBlacklistView, IsAuthenticated) in `backend/apps/authentication/views.py` + route in `backend/config/urls.py`

**Checkpoint**: role/db exist, dev runs on PostgreSQL, logout endpoint live.

---

## Phase 2: Backend Implementation (US1–US4)

**Purpose**: All API changes for the four stories in one reviewable unit.

- [ ] [P] [US4] T005 Force `recruiter` role in `RegisterSerializer.create`; remove `role` from writable fields in `backend/apps/authentication/serializers.py`
- [ ] [P] [US2] T006 Make `role` + `email` read-only in `UserSerializer` (`backend/apps/authentication/serializers.py`)
- [ ] [P] [US2] T007 Add `avatar` ImageField to `User` (`backend/apps/authentication/models.py`) + generate migration 0003
- [ ] [P] [US2] T008 Add `resize_avatar`/`avatar_filename` helpers in new `backend/apps/authentication/utils.py`
- [ ] [US2] T009 Wire `avatar` (multipart, write-only) + `avatar_url` (SerializerMethodField) into `UserSerializer.update` in `backend/apps/authentication/serializers.py`
- [ ] [P] [all] T010 Write backend tests (TDD) in new `backend/apps/authentication/tests/`: `test_register.py`, `test_login_logout.py`, `test_users.py`
- [ ] [all] T011 Run `python -m pytest` — all green; report failures instead of hiding them

**Checkpoint → REVIEW GATE (human)**: backend complete; frontend starts only after approval.

---

## Phase 3: Frontend (US1–US3)

**Purpose**: Wire the real API on top of the existing design-system UI.

- [ ] [P] [US1] T012 Remove global JSON `Content-Type` from `frontend/src/services/api.ts` (unblocks multipart)
- [ ] [P] [US1] T013 Make `AuthContext.logout` async (best-effort `POST /auth/logout/` {refresh}, then clear storage); expose `updateUser()` in `frontend/src/contexts/AuthContext.tsx`
- [ ] [US1] T014 Replace mock `currentUser` with `useAuth()` in `frontend/src/components/layout/UserMenu.tsx`; wire "My profile" → `/settings?tab=account`, "Sign out" → logout + redirect
- [ ] [P] [US1] T015 Replace mock greeting with real user in `frontend/src/pages/Dashboard.tsx`
- [ ] [P] [US2] T016 Add optional `src` prop to `frontend/src/components/ui/Avatar.tsx`
- [ ] [US2] T017 Add "My profile" tab + `?tab=` init to `frontend/src/pages/Settings.tsx`
- [ ] [US2] [US3] T018 Build `frontend/src/components/settings/AccountPanel.tsx` (profile form, avatar upload w/ preview, read-only role, change-password form w/ sonner toasts)
- [ ] [all] T019 Quality gates: `npm run build` + `npm run lint` (0 errors)

**Checkpoint**: all user stories functional end-to-end.

---

## Phase 4: Polish & Cross-Cutting

- [ ] [P] T020 Reconcile docs: `backend/.env.example` DB comment, root `README.md`, `AGENTS.md` "Current Repository State"
- [ ] T021 Full verification pass (backend check/pytest, frontend build/lint) + manual smoke test (quickstart.md#4)
- [ ] T022 Push / open PR — **human decision** (feature/auth is 8 commits ahead of origin)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 (human) → T002 → T003 (T001 prerequisite); T004 independent and parallel-safe.
- **Backend (Phase 2)**: T005/T006/T007/T008 parallel; T009 depends on T007+T008; T010/T011 after T004–T009 so tests exercise final behavior (migration must apply first).
- **Frontend (Phase 3)**: blocked on backend + REVIEW GATE. T012/T013/T015/T016 parallel; T014 after T013; T017 after T016 (Avatar) is optional; T018 after T013/017; T019 last.
- **Polish (Phase 4)**: after all stories.

### Parallel Opportunities

- T004 || T005 || T006 || T007 || T008 (all separate files)
- T012 || T013 || T015 || T016 (all separate files)
- T020 runs in parallel with frontend work.

---

## Implementation Strategy

### Incremental Delivery

1. Setup + backlog infrastructure → dev DB on PostgreSQL, logout endpoint live.
2. Backend for all four stories → tested, reviewable unit → **REVIEW GATE**.
3. Frontend wiring + AccountPanel → stories complete + demo-able.
4. Polish + docs + full gates → merge-ready.