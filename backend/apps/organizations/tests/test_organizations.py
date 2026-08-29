from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User
from apps.organizations.models import Organization

PASSWORD = "supersecret1"


def create_org(name="Northwind"):
    return Organization.objects.create(name=name)


def create_user(email, organization, role=User.Role.RECRUITER):
    return User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name="Nadia",
        last_name="Fouad",
        role=role,
        organization=organization,
    )


def create_user_without_org(email, role=User.Role.RECRUITER):
    return User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name="Nadia",
        last_name="Fouad",
        role=role,
    )


def auth_client(user):
    client = APIClient()
    tokens = client.post(
        "/api/auth/login/",
        {"email": user.email, "password": PASSWORD},
    ).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
    return client


def test_me_requires_authentication(db):
    client = APIClient()

    response = client.get("/api/organizations/me/")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_me_returns_own_organization(db):
    org = create_org("Northwind")
    user = create_user("nadia@northwind.io", org)
    client = auth_client(user)

    response = client.get("/api/organizations/me/")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == org.pk
    assert response.data["name"] == "Northwind"
    assert "created_at" in response.data


def test_me_returns_404_when_no_organization(db):
    user = create_user_without_org("solo@nowhere.io")
    client = auth_client(user)

    response = client.get("/api/organizations/me/")

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_patch_me_updates_name_as_admin(db):
    org = create_org("Northwind")
    admin = create_user("admin@northwind.io", org, role=User.Role.ADMIN)
    client = auth_client(admin)

    response = client.patch(
        "/api/organizations/me/",
        {"name": "Northwind Inc."},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Northwind Inc."
    org.refresh_from_db()
    assert org.name == "Northwind Inc."


def test_patch_me_returns_403_for_non_admin(db):
    org = create_org("Northwind")
    recruiter = create_user("nadia@northwind.io", org)
    client = auth_client(recruiter)

    response = client.patch(
        "/api/organizations/me/",
        {"name": "Northwind Inc."},
        format="json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_patch_me_returns_404_when_no_organization(db):
    user = create_user_without_org("solo@nowhere.io")
    client = auth_client(user)

    response = client.patch(
        "/api/organizations/me/",
        {"name": "Northwind Inc."},
        format="json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_members_returns_404_when_no_organization(db):
    user = create_user_without_org("solo@nowhere.io")
    client = auth_client(user)

    response = client.get("/api/organizations/me/members/")

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_members_returns_403_for_non_admin(db):
    org = create_org("Northwind")
    recruiter = create_user("nadia@northwind.io", org)
    client = auth_client(recruiter)

    response = client.get("/api/organizations/me/members/")

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_members_lists_org_users_for_admin(db):
    org = create_org("Northwind")
    other_org = create_org("Contoso")
    admin = create_user("admin@northwind.io", org, role=User.Role.ADMIN)
    recruiter = create_user("nadia@northwind.io", org)
    outsider = create_user("sarah@contoso.io", other_org, role=User.Role.RECRUITER)
    client = auth_client(admin)

    response = client.get("/api/organizations/me/members/")

    assert response.status_code == status.HTTP_200_OK
    member_ids = [user["id"] for user in response.data["results"]]
    assert admin.pk in member_ids
    assert recruiter.pk in member_ids
    assert outsider.pk not in member_ids


def test_superuser_without_org_gets_404_on_me(db):
    superuser = User.objects.create_superuser(
        email="root@northwind.io",
        password=PASSWORD,
        first_name="Root",
        last_name="User",
    )
    client = auth_client(superuser)

    response = client.get("/api/organizations/me/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
