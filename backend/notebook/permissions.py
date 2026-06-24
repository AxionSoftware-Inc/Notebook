from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import NotebookDocument


class CanReadOrEditNotebook(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            if request.user and request.user.is_authenticated:
                return obj.visibility == NotebookDocument.VISIBILITY_PUBLIC_READ or obj.owner_id == request.user.id or request.user.is_staff
            return obj.visibility == NotebookDocument.VISIBILITY_PUBLIC_READ

        if not request.user or not request.user.is_authenticated:
            return False
        return obj.owner_id == request.user.id or request.user.is_staff
