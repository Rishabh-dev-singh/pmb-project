from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# 1. LOGIN VIEW 
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        employee_id = request.data.get('employee_id')
        password = request.data.get('password')

        try:
            user = User.objects.get(employee_id=employee_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.check_password(password) and user.is_active:
            refresh = RefreshToken.for_user(user)
            
            response = Response({
                'status': 'success',
                'name': user.first_name,
                'designation': user.designation,
                'department': user.department,
            }, status=status.HTTP_200_OK)

            # Cookie set karna (path='/' add kiya gaya hai)
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=True,      # Production (HTTPS) ke liye True rakhein. Localhost ke liye False karein.
                samesite='Lax',
                path='/'          # YE SABSE ZAROORI HAI COOKIE SAVE HONE KE LIYE
            )
            return response
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# 2. LOGOUT VIEW
class LogoutView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def post(self, request):
        response = Response({'message': 'Logged out successfully'})
        response.delete_cookie('access_token', path='/') # Logout par bhi path dena zaroori hai
        return response

# 3. USER PROFILE VIEW
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        user = request.user
        return Response({
            'name': user.first_name,
            'id': user.employee_id,
            'designation': user.designation,
            'department': user.department,
        })