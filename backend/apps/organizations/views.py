from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer
from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer


class OrganizationViewSet(viewsets.GenericViewSet):
    queryset = Organization.objects.none()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        organization = getattr(self.request, "organization", None)
        if organization is None:
            raise NotFound("You are not a member of any organization.")
        return organization

    @action(detail=False, methods=["get", "patch"], url_path="me")
    def me(self, request):
        organization = self.get_object()

        if request.method == "PATCH":
            if not (request.user.role == "admin" or request.user.is_superuser):
                return Response(
                    {"detail": "Only an admin can update the organization."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            serializer = self.get_serializer(
                organization, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        return Response(self.get_serializer(organization).data)

    @action(detail=False, methods=["get"], url_path="me/members")
    def members(self, request):
        organization = self.get_object()
        if not (request.user.role == "admin" or request.user.is_superuser):
            return Response(
                {"detail": "Only an admin can list organization members."},
                status=status.HTTP_403_FORBIDDEN,
            )
        queryset = User.objects.filter(organization=organization)
        page = self.paginate_queryset(queryset)
        serializer = UserSerializer(
            page, many=True, context=self.get_serializer_context()
        )
        return self.get_paginated_response(serializer.data)
