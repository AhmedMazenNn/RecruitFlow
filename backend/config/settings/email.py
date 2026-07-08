from .env_setup import env

EMAIL_CONFIG = env.email_url("EMAIL_URL", default="consolemail://")
globals().update(**EMAIL_CONFIG)
