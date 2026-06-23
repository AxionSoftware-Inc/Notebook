from django.contrib import admin

from .models import NotebookDocument


@admin.register(NotebookDocument)
class NotebookDocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "revision", "is_locked", "updated_at", "created_at")
    search_fields = ("title", "summary")
    list_filter = ("is_locked", "created_at", "updated_at")
    readonly_fields = ("public_id", "revision", "created_at", "updated_at")
