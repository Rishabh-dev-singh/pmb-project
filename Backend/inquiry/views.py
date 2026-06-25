import json
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from accounts.models import CustomUser
from .models import LoanInquiry, AgriInquiry, Attendance, Lead, SoftwareInquiry
from .models import Productivity 
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
        send_notification("New Loan Inquiry", f"\nName : {inquiry.full_name}\nMobile : {inquiry.mobile}\nEmail : {inquiry.email}\n")
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
        send_notification("New Agri Inquiry", f"\nName : {inquiry.full_name}\nMobile : {inquiry.mobile}\nEmail : {inquiry.email}\n")
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

@csrf_exempt
def attendance_api(request):
    try:
        data = json.loads(request.body)
        emp = CustomUser.objects.get(employee_id=data.get("employee_id"))
        date_obj = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        attendance, created = Attendance.objects.get_or_create(employee=emp, date=date_obj)
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

 
def get_employees(request):
    employees = list(CustomUser.objects.all().values("employee_id", "first_name", "department", "designation"))
    return JsonResponse(employees, safe=False)

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
                
    
                bankName=data.get("bankName"),
                rmName=data.get("rmName"),
                
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
        send_notification("Software Inquiry", f"\nName : {inquiry.full_name}\nMobile : {inquiry.mobile}\nEmail : {inquiry.email}\nService : {inquiry.service_type}\n")
        return JsonResponse({"status": "success", "id": inquiry.id})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

@csrf_exempt
def get_bank_list(request):
    try:
        banks = list(Lead.objects.exclude(bankName__isnull=True).exclude(bankName__exact='').values_list('bankName', flat=True).distinct())
        return JsonResponse(banks, safe=False)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


# -----------------------------------
# PRODUCTIVITY API
# -----------------------------------
@csrf_exempt
def productivity_list_create(request):
    if request.method == "GET":
        # Logged-in user ke hisaab se data fetch karein
        # Agar user staff/manager hai, to sabka data dikha sakte hain
        # Yahan simple logic hai: employee_id ke through filter
        emp_id = request.GET.get("employee_id")
        if emp_id:
            data = list(Productivity.objects.filter(employee__employee_id=emp_id).order_by("-date").values())
        else:
            data = list(Productivity.objects.all().order_by("-date").values())
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # CustomUser (employee) ko fetch karein
            emp = CustomUser.objects.get(employee_id=data.get("employee_id"))
            
            record = Productivity.objects.create(
                employee=emp,
                total_calls=data.get("total_calls", 0),
                connected_calls=data.get("connected_calls", 0),
                interested_customers=data.get("interested_customers", ""),
                followup_customers=data.get("followup_customers", ""),
                remark=data.get("remark", "")
            )
            return JsonResponse({"status": "success", "id": record.id})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

@csrf_exempt
def delete_productivity(request, pk):
    try:
        Productivity.objects.get(id=pk).delete()
        return JsonResponse({"status": "deleted"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})