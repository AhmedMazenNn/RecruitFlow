# API Contract: User Authentication & Account

**Phase 1 output for `specs/001-user-auth-account/`**

Base URL: `http://localhost:8000/api`. All endpoints except `register`/`login`/`refresh`/`verify` require `Authorization: Bearer <access>`.

## User object (shared shape)

```json
{
  "id": 1,
  "first_name": "Nadia",
  "last_name": "Fouad",
  "email": "nadia@northwind.io",
  "role": "recruiter",
  "avatar_url": "http://localhost:8000/media/avatars/avatar_1_ab12cd34.jpg",
  "is_active": true,
  "created_at": "2026-08-29T10:00:00+00:00",
  "updated_at": "2026-08-29T10:00:00+00:00"
}
```

**Writable fields**: `first_name`, `last_name`, `avatar` (multipart) only.
**Read-only fields**: `id`, `email`, `role`, `is_active`, `created_at`, `updated_at`, `avatar_url`. Submitting read-only fields is ignored (never applied). `avatar_url` is `""` when no avatar is set.

---

## POST /api/auth/register/

AllowAny. Creates a user with role **always** `recruiter` (submitted `role` ignored).

Request:
```json
{ "first_name": "N", "last_name": "F", "email": "n@x.io", "password": "min-8-chars", "password_confirm": "min-8-chars" }
```
Responses: `201` (User object) · `400` (e.g. duplicate email, password mismatch, <8 chars).

## POST /api/auth/login/

AllowAny. Standard simplejwt token obtain pair. Request `{ "email", "password" }` → `200 {"access": "...", "refresh": "..."}` · `401` invalid credentials · `400` (inactive/disabled → account disabled error).

## POST /api/auth/refresh/

AllowAny. `{ "refresh" }` → new `access` (+ rotated `refresh` since rotation is on). `401` when the refresh token is expired or blacklisted.

## POST /api/auth/verify/

AllowAny. `{ "token" }` → `200` if valid.

## POST /api/auth/logout/   **NEW**

`IsAuthenticated`. Blacklists the presented refresh token.

Request: `{ "refresh": "<refresh token>" }`
Responses: `200 OK` on success (simplejwt verified behavior) · `401` when unauthenticated or when the refresh token is invalid/expired/already blacklisted.

## GET /api/auth/users/me/

`IsAuthenticated`. Returns the current User object.

## PATCH /api/auth/users/me_partial/

`IsAuthenticated`. Partial update of **own** account. Accepts JSON (`first_name`, `last_name`) or `multipart/form-data` (adds `avatar` file; omit to keep, `null` to clear). Responses: `200` (User object) · `400` validation · `401`.

## POST /api/auth/users/change_password/

`IsAuthenticated`. Request:
```json
{ "old_password": "...", "new_password": "min-8-chars", "new_password_confirm": "same-as-new" }
```
Responses: `204` · `400` { "old_password": ["Wrong password."] } or non-field errors · `401`.

---

## Error convention

Consistent with existing DRF behavior: field-keyed objects `{ "email": ["..."] }`, non-field errors as `{ "detail": "..." }` or `{ "non_field_errors": [...] }`. The frontend `Register.tsx` already consumes both shapes.