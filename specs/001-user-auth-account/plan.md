# Implementation Plan: User Authentication & Account

**Branch**: `feature/auth` | **Date**: 2026-08-29 | **Spec**: `specs/001-user-auth-account/spec.md`

**Input**: Feature specification from `/specs/001-user-auth-account/spec.md`

## Summary

Extend the existing `apps.authentication` module to deliver the four user stories (login/logout, account profile + avatar, change password, recruiter signup) and move the dev database to local PostgreSQL. Backend work is delivered in tasks B–E as one reviewable unit; frontend wiring and the new AccountPanel follow in tasks F–G; docs and full verification close out task H.

## Technical Context

**Language/Version**: Python 3.12 (Django 6.0.x, DRF 3.15+); TypeScript 5.5 (React 18.3, Vite 5)

**Primary Dependencies**: django-environ, djangorestframework-simplejwt (rotate + blacklist), Pillow (avatar resize), psycopg[binary]; frontend: axios, react-router-dom v6, sonner, lucide-react, tailwind-merge

**Storage**: PostgreSQL (dev and prod); avatar files in local `MEDIA_ROOT` via Django storage abstraction (`MEDIA_URL = "media/"`, `MEDIA_ROOT = backend/media`)

**Testing**: pytest + pytest-django (pyproject.toml configures `DJANGO_SETTINGS_MODULE=config.settings.development`, testpaths `apps,config`, autouse db fixture in conftest.py). Frontend: `npm run build` + `npm run lint` (no runner installed).

**Target Platform**: Linux, dev servers (backend :8000, frontend :5173)

**Project Type**: Web application (Django + DRF backend, React/Vite frontend in a modular monolith monorepo)

**Performance Goals**: N/A — auth operations are single-row lookups; p95 under 500ms without effort.

**Constraints**: Tenant-isolation rules don't apply yet (no orgs); authN/authZ must not regress. Never commit secrets; `.env` is gitignored. NO new backend dependencies (Pillow, psycopg already pinned).

**Scale/Scope**: 4 user stories + dev DB migration; no org/user-management, no reset-email flow.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Modular monolith maintained — all new code inside `apps/authentication` and existing frontend `src/` tree. PASS
- PostgreSQL for dev and prod (dev currently SQLite — this feature migrates it). PASS after Task A
- Spec-driven: spec, plan, data-model, contracts, tasks artifacts committed with the feature. PASS
- Never commit secrets: `.env` stays gitignored; only `.env.example` is committed. PASS
- No unnecessary technologies: JWT blacklist (already installed), Pillow (already pinned), no new infra. PASS
- No autonomous decisions on candidates/hiring — N/A for this feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-auth-account/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/api.md     # Phase 1 output — API contract
└── tasks.md             # Phase 2 output — task list
```

### Source Code (repository root)

```text
backend/
├── apps/authentication/
│   ├── models.py            # User + avatar field (Task D)
│   ├── serializers.py       # RegisterSerializer role lock; UserSerializer role/email/avatar (Tasks C, D)
│   ├── views.py             # LogoutView (Task B)
│   ├── utils.py             # avatar resize helper (Task D, new)
│   ├── migrations/0003_*.py # avatar field swap (Task D, generated)
│   └── tests/               # test_register, test_login_logout, test_users (Task E, new)
├── config/
│   ├── urls.py              # /api/auth/logout/ route (Task B)
│   └── settings/development.py  # PostgreSQL DB (Task A)
├── .env                     # real dev DB password (gitignored, Task A)
└── .env.example             # DB comment update (Task H)

frontend/src/
├── services/api.ts          # drop global JSON Content-Type (Task F)
├── contexts/AuthContext.tsx # async logout, updateUser (Task F)
├── components/layout/UserMenu.tsx  # real user, wired sign-out/profile (Task F)
├── components/ui/Avatar.tsx  # optional image src (Task F)
├── components/settings/AccountPanel.tsx  # new: profile/avatar/password (Task G)
├── pages/Settings.tsx       # "My profile" tab, ?tab= init (Task F)
└── pages/Dashboard.tsx      # real user greeting (Task F)
```

**Structure Decision**: Follow the existing modular-monolith layout — all changes live in the `authentication` app and matching frontend directories; no new packages or top-level dirs.

## Complexity Tracking

No constitution violations — every technology and package used already exists in the repo.