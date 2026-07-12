from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import LabourRequirement

@api_view(['POST']) 
@permission_classes([AllowAny])
def submit_requirement(request):
    try:
        data = request.data
        
        requirement = LabourRequirement.objects.create(
            full_name=data.get('name'),
            mobile=data.get('mobile'),
            email=data.get('email'),
            company_name=data.get('companyName'),
            company_address=data.get('companyAddress'),
            industry_sector=data.get('industryType'),
            required_role=data.get('workerType'),
            headcount=data.get('workerCount'),
            deployment_date=data.get('requiredDate')
        )
        
        return JsonResponse(
            {"message": "Requirement submitted successfully!"}, 
            status=status.HTTP_201_CREATED
        )
    
    except Exception as e:
        return JsonResponse(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )