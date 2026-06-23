from rest_framework import serializers

from .models import NotebookDocument


ALLOWED_BLOCK_KINDS = {
    "text",
    "formula",
    "solve",
    "graph",
    "table",
    "python",
    "theorem",
    "exercise",
    "answer",
    "export",
    "lab-result",
}


class NotebookDocumentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="public_id", read_only=True)

    class Meta:
        model = NotebookDocument
        fields = [
            "id",
            "title",
            "summary",
            "blocks",
            "metadata",
            "revision",
            "is_locked",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "revision", "created_at", "updated_at"]

    def validate_blocks(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("blocks must be a list.")
        if len(value) > 250:
            raise serializers.ValidationError("A notebook can contain at most 250 blocks.")
        if len(str(value)) > 500000:
            raise serializers.ValidationError("Notebook blocks payload is too large.")

        for index, block in enumerate(value):
            if not isinstance(block, dict):
                raise serializers.ValidationError(f"Block {index + 1} must be an object.")
            kind = block.get("kind")
            if kind not in ALLOWED_BLOCK_KINDS:
                raise serializers.ValidationError(f"Block {index + 1} kind is invalid.")
            if not isinstance(block.get("id"), str) or not block["id"].strip():
                raise serializers.ValidationError(f"Block {index + 1} id is required.")
            if not isinstance(block.get("title"), str):
                raise serializers.ValidationError(f"Block {index + 1} title is required.")
            if not isinstance(block.get("content"), str):
                raise serializers.ValidationError(f"Block {index + 1} content is required.")
            config = block.get("config", {})
            if config is not None and not isinstance(config, dict):
                raise serializers.ValidationError(f"Block {index + 1} config must be an object.")
        return value

    def validate_metadata(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("metadata must be an object.")
        if len(str(value)) > 80000:
            raise serializers.ValidationError("metadata is too large.")
        return {
            "schema_version": 1,
            "document_standard": "mathsphere.computational_notebook",
            **value,
        }

    def validate(self, attrs):
        if self.instance and self.instance.is_locked and self.context["request"].method in {"PUT", "PATCH"}:
            raise serializers.ValidationError({"is_locked": "Locked notebook cannot be modified."})
        return attrs
