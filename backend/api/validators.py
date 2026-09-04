import os
from rest_framework.exceptions import ValidationError

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf'}
ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
    'application/pdf', 'image/x-icon', 'image/vnd.microsoft.icon'
}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit

def validate_uploaded_file(file_obj):
    if not file_obj:
        raise ValidationError("No file was uploaded.")

    # 1. File size check
    if file_obj.size > MAX_FILE_SIZE_BYTES:
        raise ValidationError(
            f"File size exceeds the 10 MB limit (Uploaded size: {round(file_obj.size / (1024 * 1024), 2)} MB)."
        )

    # 2. Extension check
    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            f"File extension '{ext}' is not permitted. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 3. Content type / MIME type check
    content_type = getattr(file_obj, 'content_type', '').lower()
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise ValidationError(
            f"File content-type '{content_type}' is not allowed."
        )

    return True
