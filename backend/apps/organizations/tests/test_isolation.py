from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import User
from apps.organizations.models import Organization

PASSWORD = "supersecret1"


def create_org(name):
    return Organization.objects.create(name=name)


def create_member(email, org, role=User.Role.RECRUITER):
    return User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name="Nadia",
        last_name="Fouad",
        role=role,
        organization=org,
    )


def create_superuser(email, org):
    return User.objects.create_superuser(
        email=email,
        password=PASSWORD,
        first_name="Root",
        last_name="User",
        organization=org,
    )


def auth_client(user):
    client = APIClient()
    tokens = client.post(
        "/api/auth/login/",
        {"email": user.email, "password": PASSWORD},
    ).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
    return client


def test_admin_lists_only_own_org_users(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    admin_a = create_member("admin@a.io", org_a, role=User.Role.ADMIN)
    local = create_member("local@a.io", org_a)
    outsider = create_member("outsider@b.io", org_b)
    client = auth_client(admin_a)

    response = client.get("/api/auth/users/")

    assert response.status_code == status.HTTP_200_OK
    ids = [item["id"] for item in response.data["results"]]
    assert admin_a.pk in ids
    assert local.pk in ids
    assert outsider.pk not in ids


def test_recruiter_lists_own_org_users(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    recruiter = create_member("recruiter@a.io", org_a)
    local = create_member("local@a.io", org_a)
    outsider = create_member("outsider@b.io", org_b)
    client = auth_client(recruiter)

    response = client.get("/api/auth/users/")

    assert response.status_code == status.HTTP_200_OK
    ids = [item["id"] for item in response.data["results"]]
    assert recruiter.pk in ids
    assert local.pk in ids
    assert outsider.pk not in ids


def test_admin_cannot_update_role_of_other_org_user(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    admin_a = create_member("admin@a.io", org_a, role=User.Role.ADMIN)
    outsider = create_member("outsider@b.io", org_b, role=User.Role.ADMIN)
    client = auth_client(admin_a)

    response = client.patch(
        f"/api/auth/users/{outsider.pk}/role/",
        {"role": "recruiter"},
        format="json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    outsider.refresh_from_db()
    assert outsider.role == User.Role.ADMIN


def test_admin_cannot_toggle_active_of_other_org_user(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    admin_a = create_member("admin@a.io", org_a, role=User.Role.ADMIN)
    outsider = create_member("outsider@b.io", org_b)
    client = auth_client(admin_a)

    response = client.patch(f"/api/auth/users/{outsider.pk}/toggle_active/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    outsider.refresh_from_db()
    assert outsider.is_active is True


def test_admin_cannot_retrieve_other_org_user(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    admin_a = create_member("admin@a.io", org_a, role=User.Role.ADMIN)
    outsider = create_member("outsider@b.io", org_b)
    client = auth_client(admin_a)

    response = client.get(f"/api/auth/users/{outsider.pk}/")

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_admin_cannot_update_other_org_user_profile(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    admin_a = create_member("admin@a.io", org_a, role=User.Role.ADMIN)
    outsider = create_member("outsider@b.io", org_b)
    client = auth_client(admin_a)

    response = client.patch(
        f"/api/auth/users/{outsider.pk}/",
        {"first_name": "Hacked"},
        format="json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_admin_cannot_delete_other_org_user(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    admin_a = create_member("admin@a.io", org_a, role=User.Role.ADMIN)
    outsider = create_member("outsider@b.io", org_b)
    client = auth_client(admin_a)

    response = client.delete(f"/api/auth/users/{outsider.pk}/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert User.objects.filter(pk=outsider.pk).exists()


def test_superuser_sees_all_users(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    superuser = create_superuser("root@northwind.io", org_a)
    in_a = create_member("local@a.io", org_a)
    in_b = create_member("outsider@b.io", org_b)
    client = auth_client(superuser)

    response = client.get("/api/auth/users/")

    assert response.status_code == status.HTTP_200_OK
    ids = [item["id"] for item in response.data["results"]]
    assert superuser.pk in ids
    assert in_a.pk in ids
    assert in_b.pk in ids


def test_superuser_can_update_role_of_any_org_user(db):
    org_a = create_org("Org A")
    org_b = create_org("Org B")
    superuser = create_superuser("root@northwind.io", org_a)
    outsider = create_member("outsider@b.io", org_b, role=User.Role.ADMIN)
    client = auth_client(superuser)

    response = client.patch(
        f"/api/auth/users/{outsider.pk}/role/",
        {"role": "recruiter"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    outsider.refresh_from_db()
    assert outsider.role == User.Role.RECRUITER
