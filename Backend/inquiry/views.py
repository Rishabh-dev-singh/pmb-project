import json
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from accounts.models import CustomUser  # Naya User Model
from .models import LoanInquiry, AgriInquiry, Attendance, Lead
# Import line ko aise update kar do:
from .models import LoanInquiry, AgriInquiry, Attendance, Lead, SoftwareInquiry

@csrf_exempt
def save_inquiry(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            inquiry = LoanInquiry.objects.create(
                full_name=data.get("full_name"),
                email=data.get("email"),
                mobile=data.get("mobile"),
                loan_type=""
            )
            return JsonResponse({"status": "success", "id": inquiry.id})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
def update_loan_type(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            inquiry = LoanInquiry.objects.get(id=data.get("id"))
            inquiry.loan_type = data.get("loan_type")
            inquiry.save()
            return JsonResponse({"status": "updated"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
def agro_inquiry(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            inquiry = AgriInquiry.objects.create(
                full_name=data.get("full_name"),
                email=data.get("email"),
                mobile=data.get("mobile"),
                product_name=""
            )
            return JsonResponse({"status": "success", "id": inquiry.id})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
def update_product(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            inquiry = AgriInquiry.objects.get(id=data.get("id"))
            inquiry.product_name = data.get("product_name")
            inquiry.save()
            return JsonResponse({"status": "updated"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
def attendance_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emp_id = data.get("employee_id") 
            punch_type = data.get("type") # "IN" ya "OUT"
            time_str = data.get("time")
            date_str = data.get("date")
            
            emp = CustomUser.objects.get(employee_id=emp_id)
            today = datetime.strptime(date_str, "%Y-%m-%d").date() 
            
            obj, created = Attendance.objects.get_or_create(employee=emp, date=today)
            
            
            time_obj = datetime.strptime(time_str, "%I:%M:%S %p").time()
            
            if punch_type == "IN":
                obj.punch_in = time_obj
            elif punch_type == "OUT":
                obj.punch_out = time_obj
                
            obj.save()
            return JsonResponse({"status": "success"})
            
        except Exception as e:
            print("ERROR:", e) 
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    
    return JsonResponse({"status": "error"}, status=405)

def get_employees(request):
    if request.method == "GET":
        employees = list(CustomUser.objects.all().values('employee_id', 'first_name', 'department', 'designation'))
        return JsonResponse(employees, safe=False)


@csrf_exempt
def lead_list_create(request):
    if request.method == "GET":
        leads = list(Lead.objects.all().order_by("-id").values())
        return JsonResponse(leads, safe=False)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            lead = Lead.objects.create(
                prospectType=data.get("prospectType"),
                loanType=data.get("loanType"),
                salutation=data.get("salutation"),
                fullName=data.get("fullName"),
                mobile=data.get("mobile"),
                requiredLoanAmount=data.get("requiredLoanAmount"),
                location=data.get("location"),
                owner=data.get("owner"),
                progress=data.get("progress"),
                source=data.get("source"),
                subSource=data.get("subSource"),
                remarks=data.get("remarks"),
                nextDate=data.get("nextDate") if data.get("nextDate") else None,
                nextTime=data.get("nextTime") if data.get("nextTime") else None,
                dob=data.get("dob") if data.get("dob") else None,
                additional=data.get("additional"),
            )
            return JsonResponse({"status": "success", "id": lead.id}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

@csrf_exempt
def update_lead(request, pk):
    if request.method == "PUT" or request.method == "POST":
        try:
            data = json.loads(request.body)
            lead = Lead.objects.get(id=pk)
            lead.prospectType = data.get("prospectType", lead.prospectType)
            lead.loanType = data.get("loanType", lead.loanType)
            lead.fullName = data.get("fullName", lead.fullName)
            lead.mobile = data.get("mobile", lead.mobile)
            lead.save()
            return JsonResponse({"status": "success", "message": "Updated successfully"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)

@csrf_exempt
def delete_lead(request, pk):
    try:
        lead = Lead.objects.get(id=pk)
        lead.delete()
        return JsonResponse({"status": "deleted"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})
       

@csrf_exempt
def save_software_inquiry(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            inquiry = SoftwareInquiry.objects.create(
                full_name=data.get("full_name"),
                email=data.get("email"),
                mobile=data.get("mobile"),
                service_type=data.get("service_type")
            )
            return JsonResponse({"status": "success", "id": inquiry.id})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
        
        