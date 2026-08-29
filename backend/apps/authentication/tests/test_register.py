from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User
from apps.organizations.models import Organization


def register(client, **overrides):
    payload = {
        "first_name": "Nadia",
        "last_name": "Fouad",
        "email": "nadia@northwind.io",
        "password": "supersecret1",
        "password_confirm": "supersecret1",
    }
    payload.update(overrides)
    return client.post("/api/auth/register/", payload, format="json")


def test_register_creates_recruiter_ignoring_submitted_role(db):
    client = APIClient()
    response = register(client, role="admin")

    assert response.status_code == status.HTTP_201_CREATED
    user = User.objects.get(email="nadia@northwind.io")
    assert user.role == User.Role.RECRUITER
    assert response.data["role"] == "recruiter"


def test_register_rejects_duplicate_email(db):
    client = APIClient()
    register(client)
    response = register(client)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data


def test_register_rejects_password_mismatch(db):
    client = APIClient()
    response = register(client, password="supersecret1", password_confirm="different1")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "non_field_errors" in response.data


def test_register_rejects_short_password(db):
    client = APIClient()
    response = register(client, password="short", password_confirm="short")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.data


def test_register_creates_organization(db):
    client = APIClient()
    response = register(client, organization_name="Acme")

    assert response.status_code == status.HTTP_201_CREATED
    assert "organization" in response.data
    org = Organization.objects.get(name="Acme")
    assert response.data["organization"]["id"] == org.pk
    user = User.objects.get(email="nadia@northwind.io")
    assert user.organization == org


def test_register_defaults_organization_name(db):
    client = APIClient()
    response = register(client)

    assert response.status_code == status.HTTP_201_CREATED
    org = Organization.objects.get(name="My Organization")
    assert response.data["organization"]["id"] == org.pk
    assert User.objects.get(email="nadia@northwind.io").organization == org


def test_register_treats_whitespace_org_name_as_default(db):
    client = APIClient()
    response = register(client, organization_name="   ")

    assert response.status_code == status.HTTP_201_CREATED
    assert Organization.objects.filter(name="My Organization").exists()


def test_register_reuses_existing_organization_by_name(db):
    client = APIClient()
    first = register(client, email="one@acme.io", organization_name="Acme")
    second = register(client, email="two@acme.io", organization_name="Acme")

    assert first.status_code == status.HTTP_201_CREATED
    assert second.status_code == status.HTTP_201_CREATED
    assert first.data["organization"]["id"] == second.data["organization"]["id"]
    assert Organization.objects.filter(name="Acme").count() == 1
    assert (
        User.objects.get(email="one@acme.io").organization
        == User.objects.get(email="two@acme.io").organization
    )
