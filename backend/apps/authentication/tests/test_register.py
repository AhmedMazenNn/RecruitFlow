from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User


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
