from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow anonymous users read-only access,
    and restrict write access exclusively to authenticated staff/superuser admin users.
    Returns 401 for unauthenticated write attempts and 403 for authenticated non-staff users.
    """
    message = "You do not have administrative permission to modify portfolio CMS data."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )
