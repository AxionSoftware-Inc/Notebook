from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("notebook", "0002_notebook_platform_v1"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="notebookdocument",
            name="owner",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="notebook_documents", to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name="notebookdocument",
            name="visibility",
            field=models.CharField(choices=[("private", "Private"), ("public_read", "Public read")], default="private", max_length=20),
        ),
        migrations.CreateModel(
            name="NotebookExecutionJob",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("block_id", models.CharField(max_length=160)),
                ("block_kind", models.CharField(max_length=40)),
                ("title", models.CharField(blank=True, default="", max_length=180)),
                ("status", models.CharField(choices=[("queued", "Queued"), ("running", "Running"), ("success", "Success"), ("error", "Error"), ("timeout", "Timeout"), ("canceled", "Canceled")], default="queued", max_length=16)),
                ("runtime", models.CharField(default="hybrid", max_length=24)),
                ("cache_key", models.CharField(blank=True, default="", max_length=255)),
                ("detail", models.TextField(blank=True, default="")),
                ("inputs", models.JSONField(blank=True, default=dict)),
                ("output", models.JSONField(blank=True, default=dict)),
                ("duration_ms", models.PositiveIntegerField(default=0)),
                ("timeout_seconds", models.PositiveIntegerField(default=25)),
                ("started_at", models.DateTimeField(blank=True, null=True)),
                ("finished_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("document", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="execution_jobs", to="notebook.notebookdocument")),
                ("submitted_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="notebook_execution_jobs", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["created_at"]},
        ),
    ]
