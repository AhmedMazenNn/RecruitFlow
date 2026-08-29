# Research: User Authentication & Account

**Phase 0 output for `specs/001-user-auth-account/`**

## Current-state snapshot (verified 2026-08-29)

### Backend
- `config/settings/`: modular split. `rest_framework.py` → JWTAuthentication, `IsAuthenticated` default, JSONRenderer (+BrowsableAPI in DEBUG), PageNumberPagination PAGE_SIZE 20, drf-spectacular schema. `auth.py` → SIMPLE_JWT with `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`; `rest_framework_simplejwt.token_blacklist` is installed but has NO endpoint using it yet.
- `apps/authentication/`: custom `User` (email login, `Role` TextChoices default `candidate`), `UserSerializer`, `RegisterSerializer` (accepts `role` → privilege-escalation risk), `ChangePasswordSerializer`, `UserViewSet` (`me`, `me_partial`, `change_password`, `toggle_active`), `RegisterViewSet`, permissions (`CanManageUsers`, `IsOwnerOrAdmin`).
- Routes: JWT login/refresh/verify in `config/urls.py`; `/api/auth/users/...` + `/api/auth/register/` via app urls.
- `development.py` hardcodes SQLite; `production.py` reads `DATABASE_*` env vars and is already PostgreSQL.
- `backend/.env` is gitignored (`.gitignore:18`) and already contains `DATABASE_NAME=recruitflow` etc. with placeholder password `change-me`.
- `requirements.txt` already pins `psycopg[binary]>=3.1` and `Pillow>=10.3` → zero new dependencies.
- pytest configured in `pyproject.toml` (`DJANGO_SETTINGS_MODULE=config.settings.development`, testpaths `apps,config`); `conftest.py` provides an autouse db fixture. **No tests exist yet.**
- Local PostgreSQL 16 confirmed online on `/var/run/postgresql:5432`; `sudo` requires a password and peer auth is locked → role/db creation requires human access (documented in quickstart.md).

### Frontend
- `api.ts`: axios baseURL `http://localhost:8000/api`, request interceptor attaches `Bearer` access token, response interceptor refresh-on-401 (single retry). Sets a global `Content-Type: application/json` — this breaks multipart FormData uploads and must be removed.
- `AuthContext.tsx`: `user`/`login`/`register`/`logout`/`isAuthenticated`; bootstraps `user` from `/auth/users/me/`; `logout` is local-storage-only (no server call).
- `UserMenu.tsx` and `Dashboard.tsx` render a **mock** `currentUser` from `src/data/activity.ts` — neither uses `useAuth()`.
- `Settings.tsx` has 8 workspace tabs; there is **no account/profile section** (earlier references to `AccountPanel.jsx` were stale — the file does not exist).
- `Avatar.tsx` renders initials only; no image support. UI kit includes `Input`, `Button`, `Panel`, `PanelHeader`, `Alert`, `Select`, `Switch`; `sonner` is installed for toasts.
- No test runner; `npm run build` + `npm run lint` (0 errors) are the quality gates.

## Gaps discovered (→ implemented in tasks B–F)

1. No server-side logout / token blacklisting.
2. `RegisterSerializer` lets a caller choose `role` (can self-assign `admin`).
3. `UserSerializer.role` is writable via `me_partial` (self-promotion), and `email` is writable too.
4. Avatar is a `URLField` (no upload); needs `ImageField` + resize.
5. Frontend `AuthContext.logout` does not invalidate the session server-side.
6. Auth pages `ForgetPassword`/`ResetPassword` are local-only stubs — intentionally out of scope (decision: defer reset flow).

## Decisions recorded

- Dev DB → local PostgreSQL 16 (role `recruitflow_user`, db `recruitflow`); property of `production.py` already preserved.
- Logout = `POST /api/auth/logout/` blacklisting the refresh token, requiring authentication (`TokenBlacklistView` is AllowAny by default → subclass with `IsAuthenticated`).
- Self-registration always creates role `recruiter`; `role`+`email` read-only on the user API.
- Avatar = real upload: `ImageField(upload_to="avatars/")`, Pillow thumbnail to max 256px, JPEG; local media; S3/MinIO deferred (ADR-005).
- `account` UI = new "My profile" tab in `Settings.tsx`, initialized via `?tab=account`.
- Reset-email flow deferred; change-password does not rotate existing JWT sessions in V1.

## Risks / notes

- `TokenObtainPairSerializer` derives its username field from the model's `USERNAME_FIELD` (=`email`), so `{email, password}` login works with no override.
- Deleting a replaced avatar file: keep simple (`save(..., save=True)` leaves the old file on disk in V1; cleanup is future work).
- `django-environ` `env("DB_*")` requires the parser to define defaults before `development.py` references them — add to `env_setup.py`.