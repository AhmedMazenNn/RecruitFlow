from .base import *  # noqa: F403

DEBUG = False

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")  # noqa: F405

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DATABASE_NAME"),  # noqa: F405
        "USER": env("DATABASE_USER"),  # noqa: F405
        "PASSWORD": env("DATABASE_PASSWORD"),  # noqa: F405
        "HOST": env("DATABASE_HOST"),  # noqa: F405
        "PORT": env("DATABASE_PORT"),  # noqa: F405
    }
}

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")  # noqa: F405

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

LOGGING["handlers"]["console"] = {  # noqa: F405
    "level": "WARNING",
    "class": "logging.StreamHandler",
    "formatter": "verbose",
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
