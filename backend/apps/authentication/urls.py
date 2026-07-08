from django.urls import path
from rest_framework.routers import SimpleRouter

from apps.authentication.views import RegisterViewSet, UserViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("register/", RegisterViewSet.as_view({"post": "create"}), name="register"),
]

urlpatterns += router.urls
