# RecruitFlow

**Recruitment Management Platform (ATS)** — A production-quality application for HR teams and recruiters to manage the complete hiring process.

Built with a **React + Vite** frontend and a **Django REST Framework** backend with PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12+, Django 6.0, Django REST Framework |
| Database | PostgreSQL (production), SQLite (development) |
| Auth | JWT (djangorestframework-simplejwt) |
| API Docs | drf-spectacular (Swagger/OpenAPI) |
| Frontend | React, Vite, TypeScript |
| Code Quality | Black, isort, flake8 |
| Testing | pytest, pytest-django, pytest-cov |

---

## Project Structure

```
RecruitFlow/
├── backend/
│   ├── apps/
│   │   ├── __init__.py
│   │   └── authentication/      # Custom User model
│   │       ├── __init__.py
│   │       ├── admin.py
│   │       ├── apps.py
│   │       └── models.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── urls.py               # Root URL configuration
│   │   ├── wsgi.py
│   │   └── settings/
│   │       ├── __init__.py
│   │       ├── base.py           # Shared settings (DRF, JWT, CORS, logging)
│   │       ├── development.py    # Dev overrides (SQLite, debug, browsable API)
│   │       └── production.py     # Production overrides (PostgreSQL, security)
│   ├── logs/
│   ├── .env                      # Environment variables (gitignored)
│   ├── .env.example              # Environment variable template
│   ├── conftest.py               # pytest configuration
│   ├── manage.py
│   ├── pyproject.toml            # Tool configuration
│   └── requirements.txt
├── frontend/                     # React + Vite application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (optional for development — SQLite is used by default)

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your local values (defaults work for development)

# Run migrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | *(required)* |
| `DEBUG` | Debug mode | `False` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `[]` |
| `DATABASE_NAME` | PostgreSQL database name | `recruitflow` |
| `DATABASE_USER` | PostgreSQL user | `recruitflow_user` |
| `DATABASE_PASSWORD` | PostgreSQL password | *(required)* |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `ACCESS_TOKEN_LIFETIME` | JWT access token lifetime (minutes) | `30` |
| `REFRESH_TOKEN_LIFETIME` | JWT refresh token lifetime (days) | `1` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_HOST_USER` | SMTP user | |
| `EMAIL_HOST_PASSWORD` | SMTP password | |
| `DEFAULT_FROM_EMAIL` | Default sender email | |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173` |
| `TIME_ZONE` | Django timezone | `UTC` |
| `LANGUAGE_CODE` | Django language code | `en-us` |

---

## Available Commands

### Running the development server

```bash
python manage.py runserver
```

### Running tests

```bash
pytest
```

### Code formatting

```bash
black .
```

### Import sorting

```bash
isort .
```

### Linting

```bash
flake8
```

### Creating migrations

```bash
python manage.py makemigrations <app_name>
```

### Applying migrations

```bash
python manage.py migrate
```

---

## API Documentation

Once the server is running:

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Obtain JWT token pair |
| POST | `/api/auth/refresh/` | Refresh access token |
| POST | `/api/auth/verify/` | Verify token validity |

---

## Future Features

- Candidate management
- Job position management
- Application tracking
- Customizable hiring pipelines
- Interview scheduling
- Interview feedback collection
- Recruiter task management
- Email integration
- Recruitment analytics
- Role-based permissions
- Multi-tenant SaaS support
- Google Calendar integration

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `pytest`
4. Format code: `black . && isort .`
5. Lint: `flake8`
6. Open a pull request
