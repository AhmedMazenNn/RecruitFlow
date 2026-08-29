# RecruitFlow — Agent Context

This file gives an AI agent (OpenCode) the persistent engineering context for RecruitFlow.
It is the **primary reference** for project goals, architecture, and workflow. Detailed
per-feature requirements live in Spec Kit artifacts (see [Development Workflow](#development-workflow)),
not here.

## Product Vision

RecruitFlow is a **multi-tenant recruitment management SaaS platform** (an internal
Applicant Tracking System) for small and medium-sized companies that do not yet have a
dedicated ATS. Recruiters currently juggle candidates across CV files, email, WhatsApp,
spreadsheets, cloud storage, calendars, notes, and disconnected tools.

RecruitFlow provides **one centralized workspace** for managing the full recruitment process:
jobs, candidates, applications, pipeline stages, interviews, feedback, documents, notes,
communication, and analytics.

RecruitFlow is primarily an **internal recruitment/ATS platform**, **not a job board**. V1
targets recruiters and hiring teams; candidate-facing accounts are out of scope unless a
later specification decides otherwise.

## Target Users

- **Admin** — full organization access, settings, members, roles.
- **Recruiter** — candidates, jobs, applications, interviews, notes, communication.
- _Future internal roles_: **Hiring Manager** (assigned jobs, relevant candidates, interview
  feedback) and **Interviewer** (assigned interviews, relevant candidate info, submit feedback)
  can be added later — V1 user accounts are **Admin** or **Recruiter** only.
- _Potentially never a user_: **Candidate** — candidates are data managed by recruiters; they
  do **not** log in to RecruitFlow.

## Core Domain Model

```
Organization
    ├── Users / Memberships
    ├── Jobs
    │      └── Applications
    │            └── Candidate
    ├── Interviews
    ├── Documents
    ├── Notifications
    ├── Communications
    ├── Analytics
    └── Audit Logs
```

**Critical domain rule:**

> A **Candidate is a person**. An **Application** represents that candidate being
> considered for a **particular Job**. A single Candidate can have many Applications
> (one per Job).

```text
Candidate
    ├── Application → Job A
    ├── Application → Job B
    └── Application → Job C
```

**Do NOT** model a Candidate as belonging to only one Job. Keep Candidate and Application
as distinct concepts.

## Functional Requirements (summary)

Detailed, testable requirements are authored per-feature in Spec Kit `spec.md` artifacts.
High-level scope:

- **Organization management** — create org, settings, members, invite/remove users, assign roles.
- **Authentication** — registration, login, logout, password reset, email verification, profile, password change. (Future: Google/Microsoft OAuth, SSO.)
- **Authorization** — role-based access control, **Admin and Recruiter for V1** (Hiring Manager,
  Interviewer addable later). Rules MUST be explicit in specs.
- **Job management** — title, department, location, employment type, salary, description, requirements, hiring manager, status (Draft/Open/Paused/Closed/Archived).
- **Candidate management** — name, email, phone, location, LinkedIn/GitHub/portfolio, skills, experience, education, resume/docs, notes, tags.
- **Application management** — candidate, job, pipeline stage, recruiter, source, applied date, status, history.
- **Recruitment pipeline** — configurable stages (e.g. Applied → Screening → Technical → HR → Offer → Hired; Rejected possible mid-flow). Clarify exact model; eventually per-job stages.
- **Candidate activity timeline** — created, resume uploaded, stage changes, notes, interviews, feedback, offer, rejected, hired.
- **Notes** — with visibility rules (private vs team-visible) to be defined during clarification.
- **Tags** — e.g. React, Node.js, Senior, Remote, Urgent, Recommended.
- **Documents** — CV, cover letter, certificates; stored in object storage, metadata in PostgreSQL.
- **Interviews & feedback** — types (Phone/Technical/Behavioral/HR/Final), scheduling, interviewers, meeting URL, status; feedback = scores + comments + recommendation (Strong Hire … Strong No Hire); explicit visibility rules.
- **Communication** — email first (future: SMS/WhatsApp); no external integrations unless justified.
- **Notifications** — in-app + email (interview scheduled, assigned, stage change, feedback requested, new candidate).
- **Search & filtering** — candidates by name/email/skills/location/job/tags/experience/status; combinations supported. PostgreSQL first; dedicated search engine only if justified.
- **Dashboard / analytics** — open jobs, total candidates, interviews this week, offers, hires, funnel, conversion, time-to-hire. Define before building complex analytics.
- **Audit logs** — who/what/when, previous & new values for important actions.
- **Import/export** — CSV import (async for large datasets) and export (future).
- **AI capabilities (future)** — CV extraction, candidate–job matching. **Decision support only**; must NOT autonomously reject candidates or make final hiring decisions; output must be explainable and human-reviewable.

## Non-Functional Requirements

- **Security**: HTTPS, secure password hashing, authN/authZ, strict tenant isolation, input validation, secure file upload validation, signed/private file URLs, rate limiting, audit logging, secure secret management, OWASP practices.
  - **Critical rule — MUST NEVER be violated:**
    > Organization A MUST NEVER access Organization B's data.
- **Performance** (engineering targets, not guarantees): API p95 < ~500ms; search < ~1s; dashboard < ~2s.
- **Scalability**: grow toward thousands of orgs, large user populations, millions of candidates — do NOT prematurely introduce distributed systems.
- **Availability**: background-process failure must not take down the core app (e.g. an AI worker failing must not break core RecruitFlow).
- **Reliability**: important ops idempotent where appropriate (notifications, emails, imports, background jobs, state transitions).
- **Maintainability**: clear module boundaries, automated tests, docs, consistent naming, linting, formatting, CI/CD.
- **Observability**: structured logs, error tracking, metrics, monitoring; distributed tracing only where justified.

## Architectural Principles

- **Start as a Modular Monolith. Do NOT start with microservices.**
- Proposed backend modules: `identity, organizations, candidates, jobs, applications, interviews, documents, communications, notifications, analytics, search, ai, audit`.
- Keep module boundaries clean so a service can be extracted later if a real need emerges.
- Architectural complexity MUST be justified by actual requirements.

## Technology Direction

**Preferred stack:**

- **Frontend**: React, TypeScript, Vite, TanStack Query, React Hook Form, Zod, Tailwind CSS.
- **Backend**: Python, Django, Django REST Framework.
- **Database**: **PostgreSQL** (across all environments — dev and production).
- **Caching / async**: Redis, Celery. Redis ONLY for real benefit (caching, rate limiting, background jobs, temporary state) — never as a replacement for durable relational data in PostgreSQL.
- **File storage**: S3-compatible object storage (AWS S3, or MinIO for local dev). File metadata in PostgreSQL; file content in object storage.

**Future-only technologies** (introduce only when a concrete requirement justifies them):
Kafka, OpenSearch/Elasticsearch, pgvector, WebSockets, Kubernetes, Prometheus, Grafana, OpenTelemetry.

> Every significant technology choice MUST have a documented reason and trade-offs.
> Do not add technology just to make the project look impressive.

## Engineering Philosophy

The goal is a portfolio-grade, **specification-driven, architecture-focused** project — not
just volume of code. Prefer simple, explainable solutions.

```text
Problem → Requirements → Domain modeling → Architecture → Architecture decisions
       → Implementation → Testing → Observability → Deployment
```

Avoid: unnecessary microservices, unnecessary infrastructure, unnecessary abstractions,
premature optimization, and adding technologies without a concrete use case.

## Current Repository State (as inspected)

This is the **actual** current state (docs & code kept in sync during implementation).

- **Monorepo**: `backend/` (Django + DRF) + `frontend/` (React + Vite + TS). Git root = repo root.
- **Backend** provides the auth foundation plus modular settings scaffold:
  - Modular settings split by focus under `config/settings/`: `auth.py`, `cors.py`,
    `django_core.py`, `email.py`, `env_setup.py`, `logging_config.py`, `rest_framework.py`,
    `storage.py`, with `base.py` aggregating them, plus `development.py` and `production.py`.
  - JWT auth (`djangorestframework-simplejwt` with refresh-token blacklist), `drf-spectacular`
    (Swagger), `django-cors-headers`, `django-environ`, rotating file logging.
  - Custom `User` model lives at `apps/authentication/` (`AUTH_USER_MODEL = "authentication.User"`),
    with roles (Admin/Recruiter), avatar upload (Pillow), `RegisterSerializer`
    (self-registration always creates a `recruiter`), `LogoutView` (blacklists the refresh token),
    profile/change-password endpoints, role management for admins, an idempotent `seed_demo`
    management command (one demo user per role, `Demo@123`; promotes existing superusers to `admin`),
    and a pytest suite.
  - Dev runs on **local PostgreSQL** (env-driven, see `backend/.env`; DB `recruitflow`),
    matching the production target.
  - Auth routes: `/api/auth/{login,refresh,verify,logout,register}/` and
    `/api/auth/users/{me,me_partial,change_password,toggle_active,role}/`;
    `PATCH /api/auth/users/{id}/role/` is admin-only (role `admin` **or** `is_superuser`; 403 otherwise);
    Swagger at `/api/docs/`.
- **Frontend** has the UI design foundation plus a working auth flow:
  - Sign-in/sign-out via `AuthContext` (JWT in localStorage), route guard, `UserMenu` with the
    signed-in user and async logout, and a "My profile" account tab in `Settings`
    (`AccountPanel.tsx`: profile edit, avatar upload/remove, change password).
  - Redesigned auth pages (`components/auth/AuthShell.tsx`, `pages/auth/Login.tsx` + `Register.tsx`)
    use design primitives/tokens with motion; no external network images.
  - `frontend/src/data/` and its mock-driven components were removed; every page without a backend
    data source renders a styled "Coming soon" placeholder (`components/ui/ComingSoon.tsx`); only
    auth pages, the Settings account tab, and the admin page are functional.
  - Admin-only page at `/admin` (`pages/admin/AdminUsers.tsx`, `components/admin/UsersTable.tsx`):
    paginated users list (name/email/role/status/created), activate/deactivate, change role;
    `AdminRoute` redirects non-admins to `/` and the sidebar shows "Admin" only to admins.
  - Stack: React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod.
  - Quality gates: `npm run build` + `npm run lint` (no test runner).

## Documentation & References

- **Root `README.md`** — setup instructions, env vars, available commands (reconciled to
  current state).
- **`docs/CONTRIBUTING.md`** — git workflow, branching model (GitHub Flow from `main`),
  Conventional Commits, PR process, Definition of Done.
- **`docs/decisions/`** — home for ADRs: `001-modular-monolith.md`, `002-postgresql.md`,
  `003-redis.md`, `004-background-processing.md`, `005-object-storage.md`,
  `006-search-strategy.md`, `007-ai-matching.md` (created).
- **`.specify/`** — Spec Kit project state and templates:
  - `.specify/memory/constitution.md` — the project **constitution** (non-negotiable rules).
  - `.specify/templates/*.md` — spec/plan/tasks/checklists templates.
- Architecture diagrams (system, DB/domain, auth flow, candidate/application workflow,
  CV processing, notification architecture, AI matching, deployment) are eventual
  documentation deliverables.

## Development Workflow (Spec Kit)

RecruitFlow uses **Spec Kit** as its requirements-to-implementation workflow. The agreed path:

```text
Product Vision
    ↓
Constitution
    ↓
Specification
    ↓
Clarification
    ↓
Technical Plan
    ↓
Tasks
    ↓
Analysis
    ↓
Implementation
    ↓
Testing
    ↓
Review
```

Available OpenCode commands (in `.opencode/commands/`): `/speckit.specify`,
`/speckit.clarify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.analyze`,
`/speckit.implement`, `/speckit.converge`, `/speckit.checklist`,
`/speckit.constitution`, `/speckit.taskstoissues`.

Per feature:

```text
Requirement → Specification → Clarification → Design → Tasks
           → Implementation → Tests → Review
```

**Human review is required between major phases. When requirements are ambiguous, ask
questions rather than silently assuming.** Do not skip requirements analysis and
architectural planning to start coding faster.

Feature artifacts live under `specs/<NNN>-<short-name>/` at the repo root and include
`spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, `contracts/`,
`quickstart.md`, `checklists/`.

## Rules for Using AI

- First inspect the repository and existing docs; read relevant `AGENTS.md` instructions and
  relevant Spec Kit commands before using them.
- Reuse existing project conventions; do not overwrite existing work without understanding it.
- **Do not implement features that are not part of the approved specification.**
- Before major architectural changes, explain the trade-off.
- If requirements conflict, **stop and ask**. If a requirement is ambiguous and could affect
  architecture or data modeling, **ask for clarification**.
- Keep changes focused. Run relevant tests after implementation. **Report failures instead of
  hiding them.**
- Update documentation when architectural behavior changes.
- Keep the specification, plan, tasks, and implementation consistent.

## Rules for Introducing New Technologies

- Every significant technology choice MUST have a documented reason and trade-offs
  (capture in an ADR under `docs/decisions/` when architectural).
- Prefer the established stack (see Technology Direction). Introduce future-only technologies
  only when a concrete requirement justifies them.
- Do not add technology "to look impressive."

## Security & Privacy

- RecruitFlow handles sensitive candidate data. Follow OWASP practices.
- **Enforce strict tenant isolation (MUST, non-negotiable).**
- Use secure password hashing, signed/private file URLs, rate limiting, audit logging, and
  secure secret management. Never commit secrets.

## Testing Expectations

- Automated tests are expected (pytest / pytest-django on backend). Follow the testing strategy
  in the relevant spec/plan (contract, integration, unit) when defined.
- Run relevant tests after implementation and report failures.

## Documentation Expectations

- Maintain useful ADRs for major architectural decisions under `docs/decisions/`.
- Keep the README, Spec Kit artifacts, and AGENTS.md consistent with the implementation.
- Keep `AGENTS.md` concise; detailed requirements belong in Spec Kit artifact `spec.md` files.
