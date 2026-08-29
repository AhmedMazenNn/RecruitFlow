# Quickstart: User Authentication & Account

**Phase 1 output for `specs/001-user-auth-account/`**

## 1. One-time PostgreSQL setup (requires sudo/postgres superuser — run manually)

```bash
# 1) create the role
sudo -u postgres psql -c "CREATE ROLE recruitflow_user WITH LOGIN CREATEDB PASSWORD 'REPLACE_WITH_A_GOOD_PASSWORD';"

# 2) create the database owned by that role
sudo -u postgres psql -c "CREATE DATABASE recruitflow OWNER recruitflow_user;"

# 3) put the same password inside backend/.env (gitignored)
#    DATABASE_PASSWORD=REPLACE_WITH_A_GOOD_PASSWORD
```

`CREATEDB` is required so pytest-django can build/drop its test database.

Connectivity check:

```bash
PGPASSWORD=<password> psql -h localhost -U recruitflow_user -d recruitflow -c "SELECT 1;"
```

## 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # once
pip install -r requirements.txt                     # once
python manage.py migrate
python manage.py check
python -m pytest
python manage.py createsuperuser                    # to sign in during a manual smoke test
python manage.py runserver
```

## 3. Frontend

```bash
cd frontend
npm install     # once
npm run dev     # http://localhost:5173
```

## 4. Manual smoke test

1. Register via `/register` → lands on login.
2. Sign in with the new account → dashboard shows the real user's first name.
3. User menu (bottom-left) → **My profile** → edit name, upload an avatar (preview + persist), change password.
4. Sign out → back to login. Reusing the previous refresh token on `POST /api/auth/refresh/` returns 401 (blacklisted).

## 5. Quality gates

- `python manage.py check`
- `python -m pytest` (backend)
- `npm run build`
- `npm run lint` (expect 0 errors)