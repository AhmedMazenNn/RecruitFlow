from django.core.files.base import ContentFile
from rest_framework import serializers

from apps.authentication.models import User
from apps.authentication.utils import avatar_filename, resize_avatar
from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(write_only=True, required=False, allow_null=True)
    avatar_url = serializers.SerializerMethodField()
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "avatar",
            "avatar_url",
            "organization",
            "is_active",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "email",
            "role",
            "is_active",
            "is_superuser",
            "created_at",
            "updated_at",
        ]

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return ""
        request = self.context.get("request")
        url = obj.avatar.url
        return request.build_absolute_uri(url) if request else url

    def update(self, instance, validated_data):
        if "avatar" in validated_data:
            avatar = validated_data.pop("avatar")
            if avatar is None and instance.avatar:
                instance.avatar.delete(save=False)
            elif avatar is not None:
                instance.avatar.save(
                    avatar_filename(instance.pk),
                    ContentFile(resize_avatar(avatar), avatar_filename(instance.pk)),
                    save=False,
                )
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    organization_name = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "password_confirm",
            "organization_name",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, data):
        if data["password"] != data.pop("password_confirm"):
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        org_name = (
            validated_data.pop("organization_name", "").strip() or "My Organization"
        )
        org, _ = Organization.objects.get_or_create(name=org_name)
        validated_data["role"] = User.Role.RECRUITER
        validated_data["organization"] = org
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangeUserRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.Role.choices)

    def update(self, instance, validated_data):
        instance.role = validated_data["role"]
        instance.save(update_fields=["role"])
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, min_length=8)

    def validate(self, data):
        if data["new_password"] != data["new_password_confirm"]:
            raise serializers.ValidationError("New passwords do not match.")
        return data
