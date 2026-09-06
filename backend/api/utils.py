import os
from django.conf import settings

def build_absolute_media_url(url, request=None):
    """
    Centralized media URL builder for the Django backend.
    
    Ensures that any media path (relative, un-prefixed, or absolute)
    is converted into a valid, secure absolute URL:
    - Leaves blob: and data: URIs untouched.
    - Leaves external absolute URLs (e.g., unsplash, github) untouched.
    - Upgrades insecure http://onrender.com URLs to https://.
    - Normalizes relative paths (e.g. 'media_library/...', 'profile/...', '/media/...') to canonical '/media/...'.
    - Expands relative paths to absolute HTTPS URLs via request.build_absolute_uri()
      or fallback to settings.BACKEND_BASE_URL when request is not provided.
    """
    if not url:
        return ''
    
    url_str = str(url).strip()
    if not url_str:
        return ''
    
    # 1. Preserve data and blob URIs
    if url_str.startswith(('data:', 'blob:')):
        return url_str
    
    # 2. If already an absolute URL
    if url_str.startswith(('http://', 'https://')):
        # Enforce HTTPS on Render to prevent browser mixed-content blocks
        if url_str.startswith('http://') and 'onrender.com' in url_str:
            return 'https://' + url_str[7:]
        return url_str
    
    # 3. Normalize relative media path
    clean_path = url_str.lstrip('/')
    if clean_path.startswith('media/'):
        clean_path = clean_path[6:]
    media_path = f"/media/{clean_path}"
    
    # 4. Resolve to absolute URL via request if available
    if request:
        abs_url = request.build_absolute_uri(media_path)
        if abs_url.startswith('http://') and 'onrender.com' in abs_url:
            abs_url = 'https://' + abs_url[7:]
        return abs_url
    
    # 5. Resolve to absolute URL via BACKEND_BASE_URL fallback
    backend_base = getattr(settings, 'BACKEND_BASE_URL', '')
    if backend_base:
        return f"{backend_base.rstrip('/')}{media_path}"
    
    return media_path
