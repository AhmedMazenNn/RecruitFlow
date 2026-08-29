from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User
from apps.organizations.models import Organization


def make_png_bytes(color=(255, 0, 0), size=(512, 512)):
    image = Image.new("RGB", size, color)
    buf = BytesIO()
    image.save(buf, format="PNG")
    return buf.getvalue()


def create_user(
    email="nadia@northwind.io", password="supersecret1", role=User.Role.RECRUITER
):
    return User.objects.create_user(
        email=email,
        password=password,
        first_name="Nadia",
        last_name="Fouad",
        role=role,
    )


def auth_client(user):
    client = APIClient()
    tokens = client.post(
        "/api/auth/login/",
        {"email": user.email, "password": "supersecret1"},
    ).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
    return client


def test_me_requires_authentication(db):
    client = APIClient()

    response = client.get("/api/auth/users/me/")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_me_returns_own_data(db):
    user = create_user()
    client = auth_client(user)

    response = client.get("/api/auth/users/me/")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == user.pk
    assert response.data["email"] == user.email
    assert response.data["role"] == user.role
    assert response.data["avatar_url"] == ""


def test_me_includes_organization(db):
    org = Organization.objects.create(name="Northwind")
    user = create_user()
    user.organization = org
    user.save(update_fields=["organization"])
    client = auth_client(user)

    response = client.get("/api/auth/users/me/")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["organization"]["id"] == org.pk
    assert response.data["organization"]["name"] == "Northwind"


def test_me_partial_updates_name(db):
    user = create_user()
    client = auth_client(user)

    response = client.patch(
        "/api/auth/users/me_partial/",
        {"first_name": "Nadia Updated"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.first_name == "Nadia Updated"


def test_me_partial_ignores_role_change(db):
    user = create_user()
    client = auth_client(user)

    response = client.patch(
        "/api/auth/users/me_partial/",
        {"role": "admin"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.role == User.Role.RECRUITER


def test_me_partial_ignores_email_change(db):
    user = create_user()
    client = auth_client(user)

    response = client.patch(
        "/api/auth/users/me_partial/",
        {"email": "other@northwind.io"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.email == "nadia@northwind.io"


def test_me_partial_uploads_and_resizes_avatar(db, tmp_path):
    with override_settings(MEDIA_ROOT=str(tmp_path)):
        user = create_user()
        client = auth_client(user)
        avatar = SimpleUploadedFile(
            "avatar.png",
            make_png_bytes(size=(512, 512)),
            content_type="image/png",
        )

        response = client.patch(
            "/api/auth/users/me_partial/",
            {"avatar": avatar},
            format="multipart",
        )

        assert response.status_code == status.HTTP_200_OK
        assert "/media/avatars/" in response.data["avatar_url"]
        user.refresh_from_db()
        assert user.avatar is not None
        assert user.avatar.storage.exists(user.avatar.name)
        image = Image.open(user.avatar.path)
        assert max(image.size) <= 256


def test_change_password_success(db):
    user = create_user()
    client = auth_client(user)

    response = client.post(
        "/api/auth/users/change_password/",
        {
            "old_password": "supersecret1",
            "new_password": "brandnewpass1",
            "new_password_confirm": "brandnewpass1",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT
    user.refresh_from_db()
    assert user.check_password("brandnewpass1")

    login_response = client.post(
        "/api/auth/login/",
        {"email": user.email, "password": "brandnewpass1"},
    )
    assert login_response.status_code == status.HTTP_200_OK


def test_change_password_wrong_old_password(db):
    user = create_user()
    client = auth_client(user)

    response = client.post(
        "/api/auth/users/change_password/",
        {
            "old_password": "wrong-old-pass",
            "new_password": "brandnewpass1",
            "new_password_confirm": "brandnewpass1",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "old_password" in response.data


def test_change_password_mismatch(db):
    user = create_user()
    client = auth_client(user)

    response = client.post(
        "/api/auth/users/change_password/",
        {
            "old_password": "supersecret1",
            "new_password": "brandnewpass1",
            "new_password_confirm": "differentpass1",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "non_field_errors" in response.data
