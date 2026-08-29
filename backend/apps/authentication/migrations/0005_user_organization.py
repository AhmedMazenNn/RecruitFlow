from django.db import migrations, models


def backfill_organizations(apps, schema_editor):
    User = apps.get_model("authentication", "User")
    Organization = apps.get_model("organizations", "Organization")
    for user in User.objects.filter(organization__isnull=True):
        org, _ = Organization.objects.get_or_create(name="My Organization")
        user.organization = org
        user.save(update_fields=["organization"])


def reverse_backfill(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("organizations", "0001_initial"),
        ("authentication", "0004_alter_user_role"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="organization",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.SET_NULL,
                related_name="members",
                to="organizations.organization",
            ),
        ),
        migrations.RunPython(backfill_organizations, reverse_backfill),
    ]
