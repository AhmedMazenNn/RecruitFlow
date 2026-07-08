from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env(
    SECRET_KEY=(str, "insecure-default-key"),
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
    CORS_ALLOWED_ORIGINS=(list, ["http://localhost:5173"]),
    ACCESS_TOKEN_LIFETIME=(int, 30),
    REFRESH_TOKEN_LIFETIME=(int, 1),
    FRONTEND_URL=(str, "http://localhost:5173"),
    TIME_ZONE=(str, "UTC"),
    LANGUAGE_CODE=(str, "en-us"),
)

env.read_env(BASE_DIR / ".env")
