from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User
from apps.authentication.permissions import CanManageUsers, IsOwnerOrAdmin
from apps.authentication.serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterViewSet(viewsets.GenericViewSet):
    queryset = User.objects.none()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, CanManageUsers]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return User.objects.all()
        if user.role == "recruiter":
            return User.objects.all()
        return User.objects.filter(pk=user.pk)

    def get_permissions(self):
        if self.action in ("retrieve", "update", "partial_update", "destroy"):
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["patch"])
    def me_partial(self, request):
        serializer = self.get_serializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"old_password": "Wrong password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response(self.get_serializer(user).data)
