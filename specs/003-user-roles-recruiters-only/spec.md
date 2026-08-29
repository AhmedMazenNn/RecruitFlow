# Feature Specification: Recruiters-Only User Roles

**Feature Branch**: `feature/auth`

**Created**: 2026-08-29

**Status**: Approved (design agreed with user)

**Input**: User direction — "the app is to only be used by recruiters so they can organize their candidates' profiles and data and know the pipeline for every candidate; the candidates won't be using the app." Clarified further: **only Admin and Recruiter roles exist** for user accounts.

## Scope

- Remove the `hiring_manager` and `candidate` values from `User.Role`; user accounts can only be `admin` or `recruiter`.
- A **Candidate stays a domain concept** (the person recruiters manage). Removing the `candidate` login role does NOT remove candidate data/pages (`/candidates`, profiles, pipeline per candidate) or the future Candidates entity.
- Existing `hiring_manager`/`candidate` users are **converted to `recruiter`** (no accounts deleted).
- `seed_demo` seeds **two** demo users: `admin@recruitflow.dev` (admin) and `recruiter@recruitflow.dev` (recruiter); superuser promotion to `admin` stays.
- `role` field default becomes `recruiter` (was `candidate`).

## User Stories & Testing

### US1 — Only Admin & Recruiter roles exist (Priority: P1)

**Independent Test**: `User.Role.choices == [(admin, Admin), (recruiter, Recruiter)]`; the `role` field default is `recruiter`; existing `hiring_manager`/`candidate` rows migrate to `recruiter`.

**Acceptance Scenarios**:

1. **Given** the data model, **When** inspecting `User.Role`, **Then** only `admin` and `recruiter` choices exist.
2. **Given** a database that previously contained `hiring_manager`/`candidate` users, **When** migrations run, **Then** those users now have role `recruiter` (no deletion).
3. **Given** a new `User` created without an explicit role, **When** saved, **Then** its role is `recruiter`.
4. **Given** an API client passing `hiring_manager` or `candidate` to `PATCH /api/auth/users/{id}/role/`, **When** submitted, **Then** `400` is returned (invalid choice).

### US2 — `seed_demo` seeds Admin + Recruiter (Priority: P1)

**Independent Test**: `seed_demo` creates exactly `admin@recruitflow.dev` (admin) and `recruiter@recruitflow.dev` (recruiter); a second run adds none; superusers are promoted to `admin`.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** `seed_demo` runs, **Then** exactly two demo users exist with the documented emails/roles/password.
2. **Given** the command already ran, **When** it runs again, **Then** no duplicates (created/skipped summary).
3. **Given** an existing superuser, **When** the command runs, **Then** the superuser's role is `admin`.

## Requirements

- **FR-001**: `User.Role` MUST contain exactly `admin` and `recruiter`; `role` default MUST be `recruiter`.
- **FR-002**: A data migration MUST convert existing `hiring_manager`/`candidate` users to `recruiter` (non-destructive).
- **FR-003**: `seed_demo` MUST create only `admin` and `recruiter` demo users, stay idempotent, and keep promoting superusers to `admin`.
- **FR-004**: The role-change endpoint MUST reject removed roles (`400`).
- **FR-005**: The frontend user type and admin role dropdown MUST expose only `admin`/`recruiter`.
- **FR-006**: Existing auth behavior (recruiter-only self-registration, read-only self-service email/role, logout blacklist, admin-only role endpoint) MUST NOT regress.

## Success Criteria

- **SC-001**: Backend pytest suite green (updated tests), `manage.py check` clean, `makemigrations --check` clean.
- **SC-002**: `migrate` against local PostgreSQL converts legacy users to `recruiter`.
- **SC-003**: `seed_demo` twice produces 2 demo users (idempotent).
- **SC-004**: Frontend `npm run build` + `npm run lint` pass (0 errors); admin page role dropdown shows Admin/Recruiter only.
- **SC-005**: Docs (AGENTS.md, README, `002` contracts) list only Admin/Recruiter roles.