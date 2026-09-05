class DisableClientCacheMiddleware:
    """
    Middleware that attaches Cache-Control headers to all /api/ responses.
    Ensures browsers and intermediate CDN proxies (e.g. Vercel, Cloudflare)
    never serve stale cached data to Device A or Device B.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0, private'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
        return response
