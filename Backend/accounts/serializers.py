from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['employee_id'] = user.employee_id
        return token

    def validate(self, attrs):
        # Yahan hum map kar rahe hain ki 'username' hi 'employee_id' hai
        data = super().validate(attrs)
        return data