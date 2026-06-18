from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Cookie se 'access_token' nikaalna
        token = request.COOKIES.get('access_token')
        if not token:
            return None
        return self.get_user(self.get_validated_token(token)), token