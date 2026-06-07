import json
from datetime import datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings

from accounts.models import CustomUser
from .models import (
    LoanInquiry,
    AgriInquiry,
    Attendance,
    Lead,
    SoftwareInquiry
)

# -----------------------------------
# EMAIL FUNCTION
# -----------------------------------
def send_notification(subject, body):
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=["Atarsingh@pmb.finance"],
            fail_silently=False
        )
    except Exception as e:
        print(e)


# -----------------------------------
# LOAN INQUIRY
# -----------------------------------
@csrf_exempt
def save_inquiry(request):
    if request.method != "POST":
        return JsonResponse({"status": "error"})
        
    try:
        data = json.loads(request.body)
        inquiry = LoanInquiry.objects.create(
            full_name=data.get("full_name"),
            email=data.get("email"),
            mobile=data.get("mobile"),
            loan_type=""
        )
        
        send_notification(
            "New Loan Inquiry",
            f"\nName : {inquiry.full_name}\nMobile : {inquiry.mobile}\nEmail : {inquiry.email}\n"
        )
        
        return JsonResponse({"status": "success", "id": inquiry.id})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

@csrf_exempt
def update_loan_type(request):
    try:
        data = json.loads(request.body)
        inquiry = LoanInquiry.objects.get(id=data.get("id"))
        inquiry.loan_type = data.get("loan_type")
        inquiry.save()
        
        return JsonResponse({"status": "updated"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


# -----------------------------------
# AGRI INQUIRY
# -----------------------------------
@csrf_exempt
def agro_inquiry(request):
    try:
        data = json.loads(request.body)
        inquiry = AgriInquiry.objects.create(
            full_name=data.get("full_name"),
            email=data.get("email"),
            mobile=data.get("mobile"),
            product_name=""
        )
        
        send_notification(
            "New Agri Inquiry",
            f"\nName : {inquiry.full_name}\nMobile : {inquiry.mobile}\nEmail : {inquiry.email}\n"
        )
        
        return JsonResponse({"status": "success", "id": inquiry.id})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

@csrf_exempt
def update_product(request):
    try:
        data = json.loads(request.body)
        inquiry = AgriInquiry.objects.get(id=data.get("id"))
        inquiry.product_name = data.get("product_name")
        inquiry.save()
        
        return JsonResponse({"status": "updated"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


# -----------------------------------
# ATTENDANCE
# -----------------------------------
@csrf_exempt
def attendance_api(request):
    try:
        data = json.loads(request.body)
        emp = CustomUser.objects.get(employee_id=data.get("employee_id"))
        date_obj = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        
        attendance, created = Attendance.objects.get_or_create(
            employee=emp,
            date=date_obj
        )
        
        time_obj = datetime.strptime(data.get("time"), "%I:%M:%S %p").time()
        punch = data.get("type")
        
        if punch == "IN":
            attendance.punch_in = time_obj
        elif punch == "OUT":
            attendance.punch_out = time_obj
        elif punch == "LUNCH_START":
            attendance.lunch_start = time_obj
        elif punch == "LUNCH_END":
            attendance.lunch_end = time_obj
            
        attendance.save()
        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


# -----------------------------------
# EMPLOYEES
# -----------------------------------
def get_employees(request):
    employees = list(
        CustomUser.objects.all().values(
            "employee_id",
            "first_name",
            "department",
            "designation"
        )
    )
    return JsonResponse(employees, safe=False)


# -----------------------------------
# LEADS
# -----------------------------------
@csrf_exempt
def lead_list_create(request):
    if request.method == "GET":
        owner = request.GET.get("owner")
        role = request.GET.get("role")
        super_users = ["3800", "3801", "3802", "3803"]
        
        if role == "manager" or owner in super_users:
            queryset = Lead.objects.all()
        else:
            queryset = Lead.objects.filter(owner=owner)
            
        leads = list(queryset.order_by("-id").values())
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
                nextDate=data.get("nextDate") or None,
                nextTime=data.get("nextTime") or None,
                dob=data.get("dob") or None,
                additional=data.get("additional")
            )
            return JsonResponse({"status": "success", "id": lead.id})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

@csrf_exempt
def update_lead(request, pk):
    try:
        data = json.loads(request.body)
        lead = Lead.objects.get(id=pk)
        
        for key, value in data.items():
            setattr(lead, key, value)
            
        lead.save()
        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

@csrf_exempt
def delete_lead(request, pk):
    try:
        Lead.objects.get(id=pk).delete()
        return JsonResponse({"status": "deleted"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


# -----------------------------------
# SOFTWARE INQUIRY
# -----------------------------------
@csrf_exempt
def save_software_inquiry(request):
    try:
        data = json.loads(request.body)
        inquiry = SoftwareInquiry.objects.create(
            full_name=data.get("full_name"),
            email=data.get("email"),
            mobile=data.get("mobile"),
            service_type=data.get("service_type")
        )
        
        send_notification(
            "Software Inquiry",
            f"\nName : {inquiry.full_name}\nMobile : {inquiry.mobile}\nEmail : {inquiry.email}\nService : {inquiry.service_type}\n"
        )
        
        return JsonResponse({"status": "success", "id": inquiry.id})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})