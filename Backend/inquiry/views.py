import json
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from .models import LoanInquiry, AgriInquiry, Employee, Attendance


# ==============================
# LOAN INQUIRY
# ==============================
@csrf_exempt
def save_inquiry(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if not data.get("full_name") or not data.get("mobile"):
                return JsonResponse({"status": "error", "message": "Missing fields"})

            inquiry = LoanInquiry.objects.create(
                full_name=data.get("full_name"),
                email=data.get("email"),
                mobile=data.get("mobile"),
                loan_type=""
            )

            return JsonResponse({"status": "success", "id": inquiry.id})

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})


# ==============================
# UPDATE LOAN TYPE
# ==============================
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


# ==============================
# AGRO INQUIRY
# ==============================
@csrf_exempt
def agro_inquiry(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if not data.get("full_name") or not data.get("mobile"):
                return JsonResponse({"status": "error", "message": "Missing fields"})

            inquiry = AgriInquiry.objects.create(
                full_name=data.get("full_name"),
                email=data.get("email"),
                mobile=data.get("mobile"),
                product_name=""
            )

            return JsonResponse({"status": "success", "id": inquiry.id})

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})


# ==============================
# UPDATE PRODUCT
# ==============================
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


# ==============================
# EMPLOYEE LOGIN
# ==============================
@csrf_exempt
def employee_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            emp_id = str(data.get("emp_id")).strip()
            password = str(data.get("password")).strip()

            emp = Employee.objects.filter(emp_id=emp_id).first()

            if not emp:
                return JsonResponse({"status": "error", "message": "Employee not found"})

            if not check_password(password, emp.password):
                return JsonResponse({"status": "error", "message": "Wrong password"})

            return JsonResponse({
                "status": "success",
                "emp_id": emp.emp_id,
                "name": emp.emp_name,
                "department": emp.department,
                "designation": emp.designation
            })

        except Exception:
            return JsonResponse({"status": "error", "message": "Server Error"})


# ==============================
# ATTENDANCE API 🔥
# ==============================
@csrf_exempt
def attendance_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            emp_id = data.get("emp_id")
            action = data.get("action")

            today = datetime.now().date()

            obj, created = Attendance.objects.get_or_create(
                emp_id=emp_id,
                date=today
            )

            current_time = datetime.now().time()

            if action == "punch_in":
                obj.punch_in = current_time

            elif action == "punch_out":
                obj.punch_out = current_time

            elif action == "lunch_start":
                obj.lunch_start = current_time

            elif action == "lunch_end":
                obj.lunch_end = current_time

            obj.save()

            return JsonResponse({
                "status": "success",
                "action": action
            })

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            })


# ==============================
# GET EMPLOYEES
# ==============================
def get_employees(request):
    if request.method == "GET":
        employees = list(Employee.objects.all().values())
        return JsonResponse(employees, safe=False)