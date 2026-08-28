# RecruitFlow

**Recruitment Management Platform (ATS)** — a multi-tenant recruitment management SaaS for
small and medium-sized companies. One centralized workspace for jobs, candidates,
applications, pipeline stages, interviews, feedback, documents, notes, communication, and
analytics.

Built with a **React + Vite + TypeScript** frontend and a **Django REST Framework** backend
on **PostgreSQL**.

> Full product & architecture context lives in [`AGENTS.md`](AGENTS.md). Git workflow and
> contribution conventions live in [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).
> Architecture decisions live in [`docs/decisions/`](docs/decisions/).

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Python 3.12+, Django 6.0, Django REST Framework |
| Database   | PostgreSQL (all environments — dev and production) |
| Auth       | JWT (djangorestframework-simplejwt) |
| API Docs   | drf-spectacular (Swagger/OpenAPI) |
| Frontend   | React, Vite, TypeScript, Tailwind CSS, React Router |
| Code Quality | Black, isort, flake8 |
| Testing    | pytest, pytest-django, pytest-cov |

---

## Project Structure

```
RecruitFlow/
├── backend/                 # Django + DRF API
│   ├── apps/
│   ├── config/
│   │   ├── settings/        # Modular settings (base, development, production, auth, ...)
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── logs/
│   ├── .env.example
│   ├── manage.py
│   └── pyproject.toml
├── frontend/                # React + Vite design foundation
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── data/            # Mock data (design foundation)
│       ├── pages/
│       ├── types/
│       └── utils/
├── docs/
│   ├── decisions/           # ADRs
│   └── CONTRIBUTING.md
├── .specify/                # Spec Kit project state & templates
├── .opencode/               # OpenCode custom commands (/speckit.*)
├── AGENTS.md                # Persistent agent context
└── README.md
```

> **Notes on current state:** The backend is a scaffold (modular settings, JWT, Swagger)
> with no domain implementation yet. The frontend currently contains the **UI design
> foundation** (components, pages, mock data) that features will be built onto. See
> `AGENTS.md` → "Current Repository State".

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (dev and production)

### Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # edit values (defaults work for development)
python manage.py migrate
python manage.py runserver
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for the full list and defaults.

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | *(required in prod)* |
| `DEBUG` | Debug mode | `False` |
| `DATABASE_NAME` | PostgreSQL database name | `recruitflow` |
| `DATABASE_USER` | PostgreSQL user | `recruitflow_user` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `ACCESS_TOKEN_LIFETIME` | JWT access token lifetime (minutes) | `30` |
| `REFRESH_TOKEN_LIFETIME` | JWT refresh token lifetime (days) | `1` |

> Never commit real `.env` files or secrets. Copy from `.env.example` and fill locally.

---

## Available Commands

### Backend

```bash
python manage.py runserver   # dev server
pytest                       # tests
black . && isort .           # format
flake8                       # lint
```

### Frontend

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # eslint
```

---

## API Documentation

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

Authentication endpoints:
- `POST /api/auth/login/` — obtain JWT token pair
- `POST /api/auth/refresh/` — refresh access token
- `POST /api/auth/verify/` — verify token validity

---

## Development Workflow (Spec Kit)

RecruitFlow is **specification-driven**. Features follow the Spec Kit workflow:

```text
Constitution → Specification → Clarification → Technical Plan → Tasks
            → Analysis → Implementation → Testing → Review
```

See `docs/CONTRIBUTING.md` and `AGENTS.md` for details.

---

## Documentation

- [`AGENTS.md`](AGENTS.md) — persistent agent/project context
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — git workflow & contribution guide
- [`docs/decisions/`](docs/decisions/) — Architecture Decision Records
- `specs/` — per-feature Spec Kit artifacts (created during feature work)
