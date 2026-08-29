from rest_framework_simplejwt.authentication import JWTAuthentication


class TenantMiddleware:
    """Set request.organization from the bearer token's user.

    DRF authentication runs inside the view, so the authenticated user is not yet
    available on the plain Django request here. Resolve the JWT ourselves so any
    view (DRF or not) can rely on request.organization. Unauthenticated requests
    and token failures leave it as None and never break the request.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.authenticator = JWTAuthentication()

    def __call__(self, request):
        request.organization = None
        try:
            result = self.authenticator.authenticate(request)
        except Exception:
            result = None
        if result is not None:
            user, _ = result
            request.organization = getattr(user, "organization", None)
        return self.get_response(request)
