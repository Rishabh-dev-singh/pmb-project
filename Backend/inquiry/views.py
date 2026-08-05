import json
import csv
from datetime import datetime
from django.http import JsonResponse, HttpResponse
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


# -----------------------------------
# ATTENDANCE 
# -----------------------------------
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


# -----------------------------------
# LEADS
# -----------------------------------
@csrf_exempt
def lead_list_create(request):
    if request.method == "GET":
        owner = request.GET.get("owner")
        role = request.GET.get("role")
        super_users = ["3800", "3801", "3802", "3803", "3814"]  # Added 3814
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
        emp_id = request.GET.get("employee_id")
        role = request.GET.get("role")
        super_users = ["3800", "3801", "3802", "3803", "3814"]  # Added 3814

        # Agar user manager hai ya super_user list mein hai, toh sabka data dikhao
        if role == "manager" or emp_id in super_users:
            queryset = Productivity.objects.all().order_by("-date")
        else:
            # Normal employee sirf apna data dekhega
            queryset = Productivity.objects.filter(employee__employee_id=emp_id).order_by("-date")
        
        # .values() mein employee details (name, id) pass karna zaroori hai taaki dashboard par identify ho sake
        data = list(queryset.values(
            "id", "date", "total_calls", "connected_calls", 
            "interested_customers", "followup_customers", "remark",
            "employee__employee_id", "employee__first_name"
        ))
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

@csrf_exempt
def download_productivity_csv(request):
    if request.method == "GET":
        emp_id = request.GET.get("employee_id")
        role = request.GET.get("role")
        super_users = ["3800", "3801", "3802", "3803", "3814"]  # Added 3814

        # Sirf Super Users aur Managers download kar sakte hain
        if role != "manager" and emp_id not in super_users:
            return JsonResponse({"status": "error", "message": "You are not authorized to download this report."})

        # Saara data fetch karein
        records = Productivity.objects.all().order_by("-date", "employee__first_name")

        # HttpResponse setup for CSV                     
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="productivity_report.csv"'

        writer = csv.writer(response)
        
        # CSV Headers
        writer.writerow([
            'Date', 'Employee ID', 'Employee Name', 'Total Calls', 
            'Connected Calls', 'Interested Customers', 'Followup Customers', 'Remarks'
        ])

        # CSV Data Rows
        for record in records:
            # Handle possible empty fields or dates
            emp_name = f"{record.employee.first_name or ''}".strip()
            date_str = record.date.strftime("%Y-%m-%d") if record.date else ""
            
            writer.writerow([
                date_str,
                record.employee.employee_id,
                emp_name,
                record.total_calls,
                record.connected_calls,
                record.interested_customers,
                record.followup_customers,
                record.remark
            ])

        return response 
    


def attendance_list(request):
    emp_id = request.GET.get("employee_id")
    role = request.GET.get("role")

    super_users = ["3800", "3801", "3802", "3803", "3814"]  # Added 3814

    if role == "manager" or emp_id in super_users:
        queryset = Attendance.objects.all().order_by("-date")
    else:
        queryset = Attendance.objects.filter(
            employee__employee_id=emp_id
        ).order_by("-date")

    data = list(queryset.values(
        "id",
        "date",
        "punch_in",
        "punch_out",
        "lunch_start",
        "lunch_end",
        "employee__employee_id",
        "employee__first_name",
    ))

    return JsonResponse(data, safe=False)