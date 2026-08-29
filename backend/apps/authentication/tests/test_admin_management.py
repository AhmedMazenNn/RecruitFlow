from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User
from apps.organizations.models import Organization

PASSWORD = "supersecret1"


def make_org():
    return Organization.objects.create(name="Northwind")


def create_user(email, role=User.Role.RECRUITER, organization=None):
    if organization is None:
        organization = make_org()
    return User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name="Nadia",
        last_name="Fouad",
        role=role,
        organization=organization,
    )


def create_admin():
    return create_user(
        "admin@northwind.io", role=User.Role.ADMIN, organization=make_org()
    )


def auth_client(user):
    client = APIClient()
    tokens = client.post(
        "/api/auth/login/",
        {"email": user.email, "password": PASSWORD},
    ).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
    return client


def test_admin_updates_user_role(db):
    admin = create_admin()
    target = create_user("sam@northwind.io", organization=admin.organization)
    client = auth_client(admin)

    response = client.patch(
        f"/api/auth/users/{target.pk}/role/",
        {"role": "recruiter"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["role"] == "recruiter"
    target.refresh_from_db()
    assert target.role == User.Role.RECRUITER


def test_superuser_can_update_role(db):
    superuser = User.objects.create_superuser(
        email="root@northwind.io",
        password=PASSWORD,
        first_name="Root",
        last_name="User",
    )
    target = create_user("sam@northwind.io", role=User.Role.ADMIN)
    client = auth_client(superuser)

    response = client.patch(
        f"/api/auth/users/{target.pk}/role/",
        {"role": "recruiter"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    target.refresh_from_db()
    assert target.role == User.Role.RECRUITER


def test_removed_role_returns_400(db):
    admin = create_admin()
    target = create_user("sam@northwind.io", organization=admin.organization)
    client = auth_client(admin)

    for removed in ("hiring_manager", "candidate"):
        response = client.patch(
            f"/api/auth/users/{target.pk}/role/",
            {"role": removed},
            format="json",
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "role" in response.data


def test_non_admin_cannot_update_role(db):
    org = make_org()
    recruiter = create_user("recruiter@northwind.io", organization=org)
    target = create_user("sam@northwind.io", organization=org)
    client = auth_client(recruiter)

    response = client.patch(
        f"/api/auth/users/{target.pk}/role/",
        {"role": "admin"},
        format="json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    target.refresh_from_db()
    assert target.role == User.Role.RECRUITER


def test_invalid_role_returns_400(db):
    admin = create_admin()
    target = create_user("sam@northwind.io", organization=admin.organization)
    client = auth_client(admin)

    response = client.patch(
        f"/api/auth/users/{target.pk}/role/",
        {"role": "boss"},
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "role" in response.data
