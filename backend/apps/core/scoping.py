class ScopedQuerysetMixin:
    """Scope org-owned ViewSet querysets to request.organization.

    Unauthenticated requests and users without an organization see an empty
    queryset (least privilege). is_superuser bypasses scoping entirely.
    Subclasses must define a queryset whose model has an `organization` FK
    named `organization`.
    """

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()
        if getattr(user, "is_superuser", False):
            return queryset
        organization = getattr(self.request, "organization", None)
        if organization is None:
            return queryset.none()
        return queryset.filter(organization=organization)
