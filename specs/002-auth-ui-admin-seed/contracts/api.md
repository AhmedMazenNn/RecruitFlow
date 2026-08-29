# API Contract Additions

Feature `002-auth-ui-admin-seed`. All existing auth contracts (login, refresh, logout, register, me/me_partial, change_password) are unchanged.

## 1. Change a user's role (admin only)

`PATCH /api/auth/users/{id}/role/`

**Auth**: JWT access token; permission `IsAdmin` (role `admin` **or** `is_superuser`).

**Request body** (JSON):

```json
{ "role": "recruiter" }
```

`role` is one of `admin | recruiter` (V1: only Admin and Recruiter roles exist).

**Responses**:

- `200 OK` — returns the full user object (same shape as `GET /api/auth/users/{id}/`):

```json
{
  "id": 3,
  "email": "recruiter@recruitflow.dev",
  "first_name": "Sam",
  "last_name": "Recruiter",
  "role": "recruiter",
  "is_superuser": false,
  "is_active": true,
  "avatar_url": "",
  "created_at": "2026-08-29T10:00:00+00:00",
  "updated_at": "2026-08-29T10:00:00+00:00"
}
```

- `400 Bad Request` — invalid/missing `role` (`{"role": ["\"foo\" is not a valid choice."]}`).
- `403 Forbidden` — caller is not admin/superuser.
- `401 Unauthenticated` if no/invalid token.

## 2. UserSerializer additions

Read-only `is_superuser` boolean added to the user JSON everywhere the serializer is used (login `me`, register response, list/detail, role update). No existing field semantics change.

## 3. Unchanged endpoints used by the admin page

- `GET /api/auth/users/` — paginated list (`PageNumberPagination`, PAGE_SIZE 20): `{count, next, previous, results}`.
- `PATCH /api/auth/users/{id}/toggle_active/` — flips `is_active`, returns the user object.