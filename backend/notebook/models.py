import uuid

from django.db import models


class NotebookDocument(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=180)
    summary = models.CharField(max_length=255, blank=True, default="")
    blocks = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    revision = models.PositiveIntegerField(default=1)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]

    def __str__(self):
        return self.title
