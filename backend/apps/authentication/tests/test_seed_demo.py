from io import StringIO

from django.core.management import call_command

from apps.authentication.models import User


DEMO_USERS = {
    "admin@recruitflow.dev": User.Role.ADMIN,
    "recruiter@recruitflow.dev": User.Role.RECRUITER,
}


def run_seed_demo():
    return call_command("seed_demo", stdout=StringIO())


def test_seed_demo_creates_one_user_per_role(db):
    run_seed_demo()

    assert User.objects.count() == len(DEMO_USERS)
    for email, role in DEMO_USERS.items():
        user = User.objects.get(email=email)
        assert user.role == role
        assert user.check_password("Demo@123")
        assert user.first_name and user.last_name


def test_seed_demo_is_idempotent(db):
    run_seed_demo()
    run_seed_demo()

    assert User.objects.count() == len(DEMO_USERS)
    for email in DEMO_USERS:
        assert User.objects.filter(email=email).count() == 1


def test_seed_demo_promotes_existing_superuser_to_admin(db):
    User.objects.create_superuser(
        email="super@recruitflow.dev",
        password="supersecret1",
        first_name="Jane",
        last_name="Doe",
    )

    run_seed_demo()

    superuser = User.objects.get(email="super@recruitflow.dev")
    assert superuser.role == User.Role.ADMIN