# Feature Specification: Auth UI Redesign, Coming-Soon Sweep, Demo Seed & Admin Page

**Feature Branch**: `002-auth-ui-admin-seed`

**Created**: 2026-08-29

> **Update 2026-08-29**: role requirements here were superseded by
> [`003-user-roles-recruiters-only`](../003-user-roles-recruiters-only/): user accounts have only
> `admin`/`recruiter` roles, `seed_demo` seeds only
> `admin@recruitflow.dev` + `recruiter@recruitflow.dev`, and the role-change enum is
> `admin | recruiter`.

**Status**: Draft (awaiting review)

**Input**: User description: "Change the UI design for the login and signup modules, remove the data folder from the frontend, add a script to seed the database with mock users, and add an admin page visible only to admins."

## Clarified Scope (from questions)

- **Mock data**: The backend has no domain models yet, so the design-foundation pages (Dashboard, Jobs, Candidates, Pipeline, Interviews, Analytics, Notifications, Settings non-account tabs) will show a styled **"Coming soon"** placeholder instead of fabricated data. `frontend/src/data/` is deleted.
- **Coming-soon scope**: **Full sweep** — every mock-driven page/tab shows "Coming soon"; only the auth pages, the Settings *account* tab, and the new Admin page stay functional.
- **Admin page**: Admin-only route with a users table (name, email, role, status, created date), activate/deactivate, and **change role**. Requires a small backend extension so admins can update another user's role.
- **Seed script**: A Django management command `python manage.py seed_demo` — idempotent, one demo user per role with a known password, documented in the README.

## User Scenarios & Testing

User stories are ordered by value. Each is independently testable.

### User Story 1 - Redesigned sign-in & sign-up pages (Priority: P1)

The Login and Register pages get a modern redesign that matches the workspace design system (design tokens, UI primitives, motion), removing divergent styling and external avatar images.

**Why this priority**: Auth is the first screen users see; the headline ask is a modern login/signup look.

**Independent Test**: `npm run build` + `npm run lint` pass (0 errors); Login/Register render on mobile and desktop in both themes; the sign-in and create-account flows still work against the API; the pages contain no external image URLs and no `wrong` color-scale classes inconsistent with the design tokens.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they open `/login`, **Then** they see the redesigned page using the app's design primitives and tokens (no bare `<input>` styling detached from the design system).
2. **Given** an unauthenticated visitor, **When** they open `/register`, **Then** they see a matching redesigned page with full-name, email, password, and confirm-password fields and a show/hide password toggle.
3. **Given** either page, **When** rendered, **Then** no external network images (e.g. `pravatar.cc`) load, and the visual panel uses an in-app brand treatment.
4. **Given** valid credentials on the redesigned form, **When** submitted, **Then** the user is signed in and redirected to `/`.
5. **Given** valid registration data, **When** submitted, **Then** the account is created and the user is redirected to `/login`.

### User Story 2 - Remove frontend mock data; "Coming soon" placeholders (Priority: P1)

All pages relying on `frontend/src/data/` render an empty-state placeholder labelled "Coming soon" because the backend domain APIs do not exist yet. The `frontend/src/data/` folder is deleted.

**Why this priority**: Removes fabricated data from the product surface while keeping the app navigable, in one coherent sweep.

**Independent Test**: `frontend/src/data/` no longer exists; `rg "../../data"` (any `data/` import) returns no matches in `src/`; every affected page/tab renders a styled "Coming soon" panel; `npm run build` + `npm run lint` pass (0 errors).

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they visit `/`, `/jobs`, `/candidates`, `/pipeline`, `/interviews`, `/analytics`, `/notifications`, **Then** each shows a "Coming soon" placeholder (the Dashboard additionally keeps a greeting by user first name and the "Coming soon" panel for its widgets area).
2. **Given** the detail routes `/jobs/:jobId`, `/candidates/:candidateId`, `/interviews/:interviewId/feedback`, **When** visited, **Then** they show the same "Coming soon" placeholder (they have no backend data source).
3. **Given** the Settings page, **When** the user opens tabs other than "My profile", **Then** they show "Coming soon"; the account tab remains fully functional.
4. **Given** the frontend source tree, **When** searched for imports of the deleted data folder, **Then** none exist.

### User Story 3 - `seed_demo` command (Priority: P2)

A Django management command seeds the database with one demo user per role and known credentials; it is idempotent and safe to re-run.

**Why this priority**: Provides real users for the admin page demo and development.

**Independent Test**: `python manage.py seed_demo` creates the expected users; running it a second time creates no duplicates; `python manage.py check` passes.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** `python manage.py seed_demo` runs, **Then** one user per role exists (`admin`, `recruiter`, `hiring_manager`, `candidate`) with the documented emails and password.
2. **Given** the command has already run, **When** it runs again, **Then** no duplicate users are created (`get_or_create` semantics) and the command exits successfully reporting created/skipped counts.
3. **Given** a superuser exists, **When** the command runs, **Then** any existing superuser's role is set to `admin` so the in-app admin page is accessible to them.
4. **Given** the docs, **When** the README is read, **Then** it documents the command and the demo credentials (seeded users are fixtures, not secrets).

### User Story 4 - Admin-only user management page (Priority: P2)

An admin-visible page lists all users and lets the admin activate/deactivate a user and change a user's role. Non-admins never see the entry point and are redirected away.

**Why this priority**: Delivers the first real management surface on top of the auth module; depends on seeded users for a meaningful demo.

**Independent Test**: An admin (role `admin` or superuser) sees the Admin nav item and `/admin`; a non-admin visiting `/admin` is redirected to `/`; the users table loads from the API; toggling active and changing role persist and reflect on reload.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they open `/admin`, **Then** they see a paginated users table with name, email, role, status, and created date loaded from `GET /api/auth/users/`.
2. **Given** an authenticated non-admin (recruiter/hiring manager/candidate), **When** they try to open `/admin`, **Then** they are redirected to `/` and see no Admin nav item.
3. **Given** an admin clicking "Deactivate", **When** confirmed, **Then** the user's `is_active` flips and the row status updates.
4. **Given** an admin changing a user's role via the role selector, **When** saved, **Then** `PATCH /api/auth/users/{id}/role/` persists the role and the row reflects it.
5. **Given** a user without admin rights, **When** they call the role endpoint directly, **Then** 403 is returned by the backend.

## Edge Cases

- **Role-lock self-change**: an admin changing their own role (or another admin's) may lose admin access; OK for V1 — the UI warns but does not block.
- **Superuser default role**: `createsuperuser` leaves `role` at the default (`candidate`); admin eligibility is `role == admin` **or** `is_superuser`, and `seed_demo` also promotes existing superusers.
- **Pagination**: `GET /api/auth/users/` is page-based (PAGE_SIZE 20) — the admin table renders pagination controls.
- **Auth pages and dark mode**: both themes must remain consistent with the design tokens.
- **Existing approved auth behavior** (registration always recruiter, email/role read-only for self-service, logout blacklists token) must not regress.

## Requirements

### Functional Requirements

- **FR-001**: Login and Register pages MUST use the app's design-system primitives and tokens, support both themes, and MUST NOT load external (network) images.
- **FR-002**: All pages without a backend data source MUST render a styled "Coming soon" placeholder instead of fabricated data.
- **FR-003**: `frontend/src/data/` MUST be removed, and no frontend import may reference it.
- **FR-004**: The system MUST provide an idempotent `seed_demo` management command creating one user per role with documented credentials.
- **FR-005**: `seed_demo` MUST set an existing superuser's role to `admin` (superusers are the first admins).
- **FR-006**: The system MUST provide an admin-only page listing all users with role, status, and created date.
- **FR-007**: The system MUST let an admin activate/deactivate users and change a user's role, enforced server-side (403 for non-admins).
- **FR-008**: Non-admins MUST NOT see the Admin navigation entry and MUST be redirected away from `/admin`.
- **FR-009**: Existing auth behavior (recruiter-only self-registration, read-only email/role for self-service, logout blacklist) MUST NOT regress.

### Key Entities

- **User**: person with `first_name`, `last_name`, `email` (login), `role` (`admin`/`recruiter`/`hiring_manager`/`candidate`), `avatar` file, `is_active`, `is_superuser`, `created_at`; admin page operates on the full user set.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Login and Register pages are visually consistent with the workspace design system in both themes.
- **SC-002**: Zero imports reference `frontend/src/data/` and the folder is deleted; build + lint pass with 0 errors.
- **SC-003**: `seed_demo` runs twice with the same final user set (idempotent) and `manage.py check` passes.
- **SC-004**: An admin can complete the list → activate/deactivate → change-role loop in the UI, and a non-admin receives 403 on the role endpoint.
- **SC-005**: The existing 19 backend auth tests still pass.

## Assumptions

- No backend domain models (jobs/candidates/…) exist yet; "Coming soon" placeholders are temporary until domain features are built and get real APIs.
- The admin page manages users only; no invite/creation form this round (registration is still self-service; admin creation is future work).
- Admin eligibility = `role == "admin"` or `is_superuser`; no new permission classes beyond broadening `IsAdmin`.
- Frontend has no automated test runner; quality gates are `npm run build` + `npm run lint` (0 errors).
- `seed_demo` seeds users only (no domain data), matching the current model surface.