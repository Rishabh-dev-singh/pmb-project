from rest_framework import viewsets, serializers
from rest_framework.permissions import AllowAny
from .models import LabourRequirement

class LabourRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabourRequirement
        fields = '__all__'

class LabourRequirementViewSet(viewsets.ModelViewSet):
    queryset = LabourRequirement.objects.all().order_by('-id')
    serializer_class = LabourRequirementSerializer
    permission_classes = [AllowAny]