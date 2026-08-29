# Feature Specification: User Authentication & Account

**Feature Branch**: `001-user-auth-account`

**Created**: 2026-08-29

**Status**: Approved

**Input**: User description: "Implement the auth feature on feature/auth — recruiter sign-in/sign-out, account control (profile, avatar, password change), signup — and switch the project database to PostgreSQL."

## User Scenarios & Testing

User stories are ordered by value. Each is independently testable.

### User Story 1 - Sign in and Sign out (Priority: P1)

A recruiter can sign in with their email and password, and sign out, terminating the active session server-side.

**Why this priority**: Authentication is the foundation every other workspace capability depends on.

**Independent Test**: Sign in with valid credentials returns JWT access/refresh tokens and loads the user's profile; using those tokens yields 200s on `/auth/users/me/`. Signing out blacklists the refresh token so it can no longer be refreshed.

**Acceptance Scenarios**:

1. **Given** a registered recruiter, **When** they submit correct email/password to `POST /api/auth/login/`, **Then** they receive `access` and `refresh` tokens and can read `GET /api/auth/users/me/`.
2. **Given** a wrong password, **When** login is attempted, **Then** a 401 with an invalid-credentials error is returned and no tokens issued.
3. **Given** an authenticated user with a refresh token, **When** they call `POST /api/auth/logout/`, **Then** the refresh token is blacklisted and `POST /api/auth/refresh/` with it fails.
4. **Given** no/invalid access token, **When** `GET /api/auth/users/me/` is called, **Then** a 401 is returned.

### User Story 2 - Manage account profile and avatar (Priority: P2)

A signed-in user can edit their profile (first/last name), upload an avatar image, and see their role read-only.

**Why this priority**: Account self-service is required before user management tooling; the avatar is a small, high-visibility slice of it.

**Independent Test**: `PATCH /auth/users/me_partial/` updates the name and accepts a multipart `avatar` upload, returning an absolute `avatar_url`; sending `role` in the payload is ignored.

**Acceptance Scenarios**:

1. **Given** an authenticated recruiter, **When** they PATCH `first_name`/`last_name`, **Then** the change persists and `me` reflects it.
2. **Given** an authenticated recruiter, **When** they upload an image file as `avatar`, **Then** it is resized to max 256x256, stored under `media/avatars/`, and `avatar_url` reflects it.
3. **Given** an authenticated recruiter, **When** they include `role: "admin"` in a profile update, **Then** the role does not change.
4. **Given** an unauthenticated request, **When** `me_partial` is called, **Then** 401 is returned.

### User Story 3 - Change password (Priority: P3)

A signed-in user can change their password after confirming the current one.

**Why this priority**: Needed for account hygiene and credential recovery paths; the API already exists, so it is a small frontend slice.

**Independent Test**: `POST /auth/users/change_password/` succeeds with current + matching new passwords and rejects wrong/mismatched input.

**Acceptance Scenarios**:

1. **Given** correct current password and matching new passwords, **When** change is submitted, **Then** 204 and subsequent logins use the new password.
2. **Given** a wrong current password, **When** change is submitted, **Then** 400 with `old_password` error.
3. **Given** mismatched new passwords, **When** change is submitted, **Then** 400 with a non-field error.

### User Story 4 - Sign up as recruiter (Priority: P2)

A new user can create an account which is automatically given the recruiter role; role selection is not offered.

**Why this priority**: Self-registration is the only current account-creation path and must not allow privilege escalation.

**Independent Test**: Registering with any `role` value produces a user whose role is `recruiter`.

**Acceptance Scenarios**:

1. **Given** a registration payload including `role: "admin"`, **When** registration runs, **Then** the created user's role is `recruiter`.
2. **Given** a duplicate email, **When** registration runs, **Then** 400 with an email error.
3. **Given** mismatched `password`/`password_confirm`, **When** registration runs, **Then** 400.

### Edge Cases

- Avatar unset: `avatar_url` must be `""`, not a broken URL.
- Refresh token already blacklisted/expired on logout: logout must not error the client (best-effort with local clear).
- Media serving in dev: `MEDIA_URL`/`MEDIA_ROOT` already wired via `config/urls.py` DEBUG static().

## Requirements

### Functional Requirements

- **FR-001**: System MUST authenticate recruiters with email + password and issue JWT access/refresh tokens.
- **FR-002**: System MUST terminate a session server-side on sign-out by blacklisting the refresh token.
- **FR-003**: Users MUST be able to edit `first_name`/`last_name` via the self-service API.
- **FR-004**: Users MUST be able to upload an avatar image; storing MUST enforce a maximum dimension and JPEG normalization.
- **FR-005**: Users MUST be able to change their password by confirming the current password.
- **FR-006**: Self-registration MUST always create users with the `recruiter` role and ignore any submitted role.
- **FR-007**: `role` and `email` MUST be read-only through the user API.
- **FR-008**: The development environment MUST use PostgreSQL, same as production.

### Key Entities

- **User**: person with `first_name`, `last_name`, `email` (login), `role`, `avatar` file, `is_active`; every API surface in this feature operates on the current user.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A recruiter can go from email+password entry to a signed-in workspace in under 10 seconds.
- **SC-002**: After sign-out, the presented refresh token fails `POST /api/auth/refresh/` with 401.
- **SC-003**: Registration, login, logout, profile update, avatar upload, and password change are covered by automated backend tests; all pass.
- **SC-004**: No path exists for a user to change their own `role` or `email`.

## Assumptions

- Sign-out ends the current device session only; "sign out all sessions" is future work.
- Changing a password does not invalidate existing JWT sessions in V1 (tokens remain valid until expiry).
- Email change is not offered in V1 (`email` read-only); an identity-management feature will revisit it.
- Password reset email flow stays out of scope (stub pages unchanged) per clarification.
- Avatar uploads go to local `MEDIA_ROOT`; S3/MinIO integration follows ADR-005 later and requires no contract change.
- Frontend has no automated test runner; frontend quality gates are `npm run build` + `npm run lint` (0 errors).