from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("notebook", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="NotebookSnapshot",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("label", models.CharField(blank=True, default="", max_length=180)),
                ("source", models.CharField(default="autosave", max_length=32)),
                ("blocks", models.JSONField(blank=True, default=list)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("revision", models.PositiveIntegerField(default=1)),
                ("is_named", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("document", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="snapshots", to="notebook.notebookdocument")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="NotebookExecutionRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("block_id", models.CharField(max_length=160)),
                ("block_kind", models.CharField(max_length=40)),
                ("title", models.CharField(blank=True, default="", max_length=180)),
                ("status", models.CharField(default="success", max_length=16)),
                ("runtime", models.CharField(default="local", max_length=24)),
                ("cache_key", models.CharField(blank=True, default="", max_length=255)),
                ("detail", models.TextField(blank=True, default="")),
                ("inputs", models.JSONField(blank=True, default=dict)),
                ("output", models.JSONField(blank=True, default=dict)),
                ("duration_ms", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("document", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="execution_records", to="notebook.notebookdocument")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="NotebookImportRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("source", models.CharField(max_length=80)),
                ("external_id", models.CharField(blank=True, default="", max_length=120)),
                ("title", models.CharField(max_length=180)),
                ("payload", models.JSONField(blank=True, default=dict)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("document", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="imports", to="notebook.notebookdocument")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
