from django.core.management.base import BaseCommand

from apps.authentication.models import User


DEMO_PASSWORD = "Demo@123"

DEMO_USERS = [
    ("admin@recruitflow.dev", "Admin", "User", User.Role.ADMIN),
    ("recruiter@recruitflow.dev", "Recruiter", "User", User.Role.RECRUITER),
]


class Command(BaseCommand):
    help = "Create one demo user per role with known credentials (idempotent)."

    def handle(self, *args, **options):
        created = 0
        skipped = 0

        for email, first_name, last_name, role in DEMO_USERS:
            user, was_created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "role": role,
                },
            )
            if was_created:
                user.set_password(DEMO_PASSWORD)
                user.save(update_fields=["password"])
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created {email} ({role})"))
            else:
                skipped += 1
                self.stdout.write(self.style.WARNING(f"Skipped {email} (already exists)"))

        promoted = User.objects.filter(is_superuser=True).exclude(
            role=User.Role.ADMIN
        ).update(role=User.Role.ADMIN)
        if promoted:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Promoted {promoted} superuser(s) to role 'admin'"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(f"Done: {created} created, {skipped} skipped.")
        )