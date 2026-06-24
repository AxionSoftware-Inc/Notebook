import uuid

from django.conf import settings
from django.db import models


class NotebookDocument(models.Model):
    VISIBILITY_PRIVATE = "private"
    VISIBILITY_PUBLIC_READ = "public_read"
    VISIBILITY_CHOICES = [
        (VISIBILITY_PRIVATE, "Private"),
        (VISIBILITY_PUBLIC_READ, "Public read"),
    ]

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notebook_documents", null=True, blank=True)
    title = models.CharField(max_length=180)
    summary = models.CharField(max_length=255, blank=True, default="")
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default=VISIBILITY_PRIVATE)
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


class NotebookSnapshot(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    document = models.ForeignKey(NotebookDocument, on_delete=models.CASCADE, related_name="snapshots")
    label = models.CharField(max_length=180, blank=True, default="")
    source = models.CharField(max_length=32, default="autosave")
    blocks = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    revision = models.PositiveIntegerField(default=1)
    is_named = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.document.title} snapshot r{self.revision}"


class NotebookExecutionRecord(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    document = models.ForeignKey(NotebookDocument, on_delete=models.CASCADE, related_name="execution_records")
    block_id = models.CharField(max_length=160)
    block_kind = models.CharField(max_length=40)
    title = models.CharField(max_length=180, blank=True, default="")
    status = models.CharField(max_length=16, default="success")
    runtime = models.CharField(max_length=24, default="local")
    cache_key = models.CharField(max_length=255, blank=True, default="")
    detail = models.TextField(blank=True, default="")
    inputs = models.JSONField(default=dict, blank=True)
    output = models.JSONField(default=dict, blank=True)
    duration_ms = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.document.title} {self.block_kind} {self.status}"


class NotebookExecutionJob(models.Model):
    STATUS_QUEUED = "queued"
    STATUS_RUNNING = "running"
    STATUS_SUCCESS = "success"
    STATUS_ERROR = "error"
    STATUS_TIMEOUT = "timeout"
    STATUS_CANCELED = "canceled"
    STATUS_CHOICES = [
        (STATUS_QUEUED, "Queued"),
        (STATUS_RUNNING, "Running"),
        (STATUS_SUCCESS, "Success"),
        (STATUS_ERROR, "Error"),
        (STATUS_TIMEOUT, "Timeout"),
        (STATUS_CANCELED, "Canceled"),
    ]

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    document = models.ForeignKey(NotebookDocument, on_delete=models.CASCADE, related_name="execution_jobs")
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="notebook_execution_jobs", null=True, blank=True)
    block_id = models.CharField(max_length=160)
    block_kind = models.CharField(max_length=40)
    title = models.CharField(max_length=180, blank=True, default="")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_QUEUED)
    runtime = models.CharField(max_length=24, default="hybrid")
    cache_key = models.CharField(max_length=255, blank=True, default="")
    detail = models.TextField(blank=True, default="")
    inputs = models.JSONField(default=dict, blank=True)
    output = models.JSONField(default=dict, blank=True)
    duration_ms = models.PositiveIntegerField(default=0)
    timeout_seconds = models.PositiveIntegerField(default=25)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.document.title} job {self.block_kind} {self.status}"


class NotebookImportRecord(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    document = models.ForeignKey(NotebookDocument, on_delete=models.CASCADE, related_name="imports")
    source = models.CharField(max_length=80)
    external_id = models.CharField(max_length=120, blank=True, default="")
    title = models.CharField(max_length=180)
    payload = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.document.title} import {self.source}"
