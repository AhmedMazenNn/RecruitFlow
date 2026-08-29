# API Contract Additions

Feature `004-organizations-multi-tenancy`. Backend-foundation only; existing auth contracts are unchanged except where noted (registration gains `organization_name`, user scoping changes).

## 1. Organization object shape

Everywhere an organization is returned:

```json
{
  "id": 1,
  "name": "Acme",
  "created_at": "2026-08-29T10:00:00+00:00",
  "updated_at": "2026-08-29T10:00:00+00:00"
}
```

## 2. Registration with organization

`POST /api/auth/register/`

**Request body** (JSON) — existing fields plus optional `organization_name`:

```json
{
  "email": "recruiter@example.com",
  "first_name": "Sam",
  "last_name": "Recruiter",
  "password": "hunter2hunter2",
  "password_confirm": "hunter2hunter2",
  "organization_name": "Acme"
}
```

- `organization_name` optional; blank/missing → `My Organization`.
- Created org uses **get-or-create by exact name**.

**Responses**:

- `201 Created` — user object; `organization` added as nested read-only info:

```json
{
  "id": 3,
  "email": "recruiter@example.com",
  "first_name": "Sam",
  "last_name": "Recruiter",
  "role": "recruiter",
  "is_superuser": false,
  "is_active": true,
  "avatar_url": "",
  "organization": {
    "id": 2,
    "name": "Acme"
  },
  "created_at": "2026-08-29T10:00:00+00:00",
  "updated_at": "2026-08-29T10:00:00+00:00"
}
```

- `400 Bad Request` — existing validation failures (email taken, password mismatch, weak password).

## 3. `GET /api/auth/users/me/` organization field

The `me` response gains the same nested `organization` object (`{"id", "name"}`) as registration. All other user payloads (list/detail/role update) include it too.

## 4. Organization endpoints

### 4.1 Get own organization

`GET /api/organizations/me/`

**Auth**: JWT access token (any member of an org).

**Responses**:

- `200 OK` — the full organization object (section 1).
- `404 Not Found` — user has no organization.

### 4.2 Update own organization name

`PATCH /api/organizations/me/`

**Auth**: JWT access token; admin of that org (role `admin` **or** `is_superuser`, per the existing `IsAdmin` convention).

**Request body** (JSON):

```json
{ "name": "Acme Inc." }
```

**Responses**:

- `200 OK` — updated organization object.
- `400 Bad Request` — invalid/missing `name`.
- `403 Forbidden` — member but not org admin.
- `404 Not Found` — no organization.

### 4.3 List org members

`GET /api/organizations/me/members/`

**Auth**: JWT access token; admin of that org. Paginated (`PageNumberPagination`, PAGE_SIZE 20): `{count, next, previous, results}` reusing the existing `UserSerializer` list shape.

**Responses**:

- `200 OK` — paginated list of the org's users.
- `403 Forbidden` — member but not org admin.
- `404 Not Found` — no organization.

## 5. Tenant scoping changes to existing user endpoints

- `GET /api/auth/users/` — filtered to the caller's organization. Superusers bypass and see all users.
- `PATCH /api/auth/users/{id}/role/`, `PATCH /api/auth/users/{id}/toggle_active/`, `GET /api/auth/users/{id}/`, `DELETE /api/auth/users/{id}/` — target user must belong to the caller's org; otherwise **404 Not Found**. Superusers bypass.
- `GET /api/auth/users/me/`, `PATCH .../me_partial/`, `POST .../change_password/` — self endpoints, unaffected by scoping.
- Cross-org access returns **404** (not 403) to avoid leaking the existence of other orgs' data.