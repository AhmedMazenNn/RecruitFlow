from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User


def create_user(email="nadia@northwind.io", password="supersecret1"):
    return User.objects.create_user(
        email=email,
        password=password,
        first_name="Nadia",
        last_name="Fouad",
    )


def login(client, email="nadia@northwind.io", password="supersecret1"):
    return client.post("/api/auth/login/", {"email": email, "password": password})


def test_login_returns_access_and_refresh_tokens(db):
    create_user()
    client = APIClient()

    response = login(client)

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data


def test_login_rejects_wrong_password(db):
    create_user()
    client = APIClient()

    response = login(client, password="wrongpassword")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_rejects_inactive_user(db):
    create_user()
    User.objects.filter(email="nadia@northwind.io").update(is_active=False)
    client = APIClient()

    response = login(client)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_logout_requires_authentication(db):
    client = APIClient()

    response = client.post("/api/auth/logout/", {"refresh": "token"}, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_logout_blacklists_refresh_token(db):
    create_user()
    client = APIClient()

    tokens = login(client).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")

    logout_response = client.post(
        "/api/auth/logout/", {"refresh": tokens["refresh"]}, format="json"
    )

    assert logout_response.status_code == status.HTTP_200_OK

    refresh_response = client.post(
        "/api/auth/refresh/", {"refresh": tokens["refresh"]}, format="json"
    )

    assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED


def test_logout_with_already_blacklisted_token_returns_401(db):
    create_user()
    client = APIClient()

    tokens = login(client).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
    client.post("/api/auth/logout/", {"refresh": tokens["refresh"]}, format="json")

    second = client.post(
        "/api/auth/logout/", {"refresh": tokens["refresh"]}, format="json"
    )

    assert second.status_code == status.HTTP_401_UNAUTHORIZED
