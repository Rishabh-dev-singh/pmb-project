from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginView(APIView):

    def post(self, request):

        employee_id = request.data.get('username')
        password = request.data.get('password')

        print(f"DEBUG: Trying to find user with ID: {employee_id}")

        try:
            user = User.objects.get(employee_id=employee_id)

            print(f"DEBUG: User found: {user.employee_id}")

        except User.DoesNotExist:

            print("DEBUG: User NOT found in database!")

            return Response(
                {'error': 'User with this ID does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.check_password(password):

            print("DEBUG: Password matched!")

            if not user.is_active:

                return Response(
                    {'error': 'Account is disabled'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)

            return Response({
                'status': 'success',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'name': getattr(user, 'first_name', ''),
                'designation': getattr(user, 'designation', ''),
                'department': getattr(user, 'department', ''),
            }, status=status.HTTP_200_OK)

        else:

            print("DEBUG: Password mismatch!")

            return Response(
                {'error': 'Invalid Password'},
                status=status.HTTP_401_UNAUTHORIZED
            )