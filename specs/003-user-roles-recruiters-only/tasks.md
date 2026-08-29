# Tasks: Recruiters-Only User Roles

**Input**: `specs/003-user-roles-recruiters-only/` (spec + plan, approved).

**Tests**: Backend pytest (TDD where noted); frontend gates `npm run build` + `npm run lint` (0 errors).

**Ordering**: Tests first (T001–T002), then model + migration + command (T003–T005), backend verify (T006), frontend (T007–T008), docs (T009), final verify (T010).

## Implementation

- [ ] T001 Write expected tests: update `test_seed_demo.py` to `DEMO_USERS` of 2 (admin, recruiter); update `test_admin_management.py` role patches to `recruiter` (valid) and assert `candidate`/`hiring_manager` → 400 (`User.Role.choices` only admin/recruiter). Expect failures before model change.
- [ ] T002 Update `backend/apps/authentication/models.py` `User.Role` to `ADMIN`/`RECRUITER` and `role` default to `Role.RECRUITER`.
- [ ] T003 Author migration `0004`: RunPython data migration (convert `hiring_manager`/`candidate` role rows → `recruiter`) + `AlterField` (new choices/default). Verify with `makemigrations --check` after.
- [ ] T004 Update `backend/apps/authentication/management/commands/seed_demo.py` `DEMO_USERS` to two users (admin, recruiter).
- [ ] T005 Simplify `get_queryset` in `backend/apps/authentication/views.py` (admin/recruiter/superuser → `User.objects.all()`).
- [ ] T006 Backend verify: `migrate` on local PostgreSQL (legacy users → recruiter), `seed_demo` twice (idempotent), full pytest green, `manage.py check`, `makemigrations --check`.
- [ ] T007 Update `frontend/src/contexts/AuthContext.tsx` `User.role` union to `'admin' | 'recruiter'`.
- [ ] T008 Update `frontend/src/components/admin/UsersTable.tsx` role options/tones/types to Admin + Recruiter.
- [ ] T009 Reconcile docs: `AGENTS.md` (roles line + target users note), `README.md` seed table, `specs/002-auth-ui-admin-seed/contracts/api.md` role enum; mark T checkboxes in this file.
- [x] T010 Final verification: full backend pytest + `manage.py check` + `makemigrations --check`; frontend `npm run build` + `npm run lint` (0 errors); admin page role dropdown shows only Admin/Recruiter.

## Notes

- Candidate-as-data is out of scope and untouched (`/candidates`, profiles, pipeline).
- Existing auth behavior must not regress (recruiter-only registration, self-service read-only email/role, logout blacklist, admin-only role endpoint).
- Seed/promoted credentials are demo fixtures, not secrets.