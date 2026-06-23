import logging

from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle

from .models import NotebookDocument
from .serializers import NotebookDocumentSerializer


logger = logging.getLogger(__name__)


class NotebookDocumentViewSet(viewsets.ModelViewSet):
    queryset = NotebookDocument.objects.all()
    serializer_class = NotebookDocumentSerializer
    permission_classes = [AllowAny]
    http_method_names = ["get", "post", "put", "patch", "head", "options"]
    lookup_field = "public_id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "summary"]
    ordering_fields = ["created_at", "updated_at", "title"]
    ordering = ["-updated_at"]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "notebook_documents"

    def get_queryset(self):
        queryset = super().get_queryset()
        query = (self.request.query_params.get("q") or "").strip()
        if query:
            queryset = queryset.filter(title__icontains=query)
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        logger.info("notebook_created", extra={"notebook_id": str(instance.public_id), "revision": instance.revision})

    def perform_update(self, serializer):
        instance = serializer.save(revision=serializer.instance.revision + 1)
        logger.info("notebook_updated", extra={"notebook_id": str(instance.public_id), "revision": instance.revision})
