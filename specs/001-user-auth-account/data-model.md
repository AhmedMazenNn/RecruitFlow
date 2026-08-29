# Data Model: User Authentication & Account

**Phase 1 output for `specs/001-user-auth-account/`**

## Entities

### User (existing `apps.authentication.models.User`, one field change)

| Attribute      | Type                          | Notes                                                        |
|----------------|-------------------------------|---------------------------------------------------------------|
| `id`           | BigAutoField (PK)             | read-only via API                                             |
| `first_name`   | CharField(150)                | editable via `me_partial`                                     |
| `last_name`    | CharField(150)                | editable via `me_partial`                                     |
| `email`        | EmailField(unique)            | USERNAME_FIELD; **read-only** via API                         |
| `role`         | CharField(20, TextChoices)    | default `candidate`; **read-only** via API; registration always `recruiter` |
| `avatar`       | ImageField(upload_to="avatars/", blank=True, null=True)  | **NEW** — replaces `avatar_url` URLField |
| `is_active`    | BooleanField(default=True)    | read-only via self-service API                                |
| `is_staff`     | BooleanField                  | internal                                                     |
| `created_at` / `updated_at` | DateTimeField      | read-only via API                                             |

**Migration**: `0003` — RemoveField `avatar_url`, AddField `avatar`, AlterField nothing else.

**Derived API field**: `avatar_url` becomes a read-only `SerializerMethodField` → absolute URL of `avatar` (or `""` when unset). The wire contract for `avatar_url` is unchanged, so the frontend `User` interface does not need to change.

## Relationships

- `User` has no relational edges within this feature (memberships/orgs are out of scope).
- `User.objects` = 1 row per person; `email` is the login identifier.

## Validation rules

| Rule | Enforcement point |
|------|-------------------|
| `avatar` file resized to max 256x256, normalized to JPEG (quality 85) | `apps/authentication/utils.py::resize_avatar` invoked from `UserSerializer.update` |
| `avatar` accepts `None` (clear) | `ImageField(allow_null=True)` |
| new password min length 8 and match confirmation | `ChangePasswordSerializer` |
| registration password min length 8 + match | `RegisterSerializer` |
| duplicate email rejected | `RegisterSerializer.validate_email` (existing) |
| wrong current password rejected | `UserViewSet.change_password` (existing) |

## Blacklist bookkeeping (side-effect store)

`rest_framework_simplejwt.token_blacklist` persists used/blacklisted refresh-token JWTs in its own tables (already installed, no schema change).