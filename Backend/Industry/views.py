from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import LabourRequirement

@api_view(['GET', 'POST', 'PATCH']) 
@permission_classes([AllowAny])
def submit_requirement(request, pk=None):
    if request.method == 'GET':
        try:
            requirements = LabourRequirement.objects.all().order_by('-id')
            data = []
            for req in requirements:
                data.append({
                    "id": req.id,
                    "full_name": req.full_name,
                    "mobile": req.mobile,
                    "email": req.email,
                    "company_name": req.company_name,
                    "company_address": req.company_address,
                    "industry_sector": req.industry_sector,
                    "required_role": req.required_role,
                    "headcount": req.headcount,
                    "deployment_date": str(req.deployment_date),
                    "status": req.status,
                    "accepted_by": req.accepted_by
                })
            return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_RESET)

    elif request.method == 'POST':
        try:
            data = request.data
            LabourRequirement.objects.create(
                full_name=data.get('name'),
                mobile=data.get('mobile'),
                email=data.get('email'),
                company_name=data.get('companyName'),
                company_address=data.get('companyAddress'),
                industry_sector=data.get('industryType'),
                required_role=data.get('workerType'),
                headcount=data.get('workerCount'),
                deployment_date=data.get('requiredDate'),
                status='Pending'
            )
            return JsonResponse({"message": "Requirement submitted successfully!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        try:
            if not pk:
                return JsonResponse({"error": "Primary key required"}, status=status.HTTP_400_BAD_REQUEST)
            req_obj = LabourRequirement.objects.get(pk=pk)
            data = request.data
            if 'status' in data:
                req_obj.status = data.get('status')
            if 'accepted_by' in data:
                req_obj.accepted_by = data.get('accepted_by')
            req_obj.save()
            return JsonResponse({"message": "Updated successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)