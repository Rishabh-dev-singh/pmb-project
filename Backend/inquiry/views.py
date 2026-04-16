import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import LoanInquiry, AgriInquiry, Employee


# ==============================
# SAVE LOAN INQUIRY
# ==============================

@csrf_exempt
def save_inquiry(request):
    if request.method == "POST":
        data = json.loads(request.body)

        inquiry = LoanInquiry.objects.create(
            full_name=data.get("full_name"),
            email=data.get("email"),
            mobile=data.get("mobile"),
            loan_type=""
        )

        return JsonResponse({
            "status": "success",
            "id": inquiry.id
        })


# ==============================
# UPDATE LOAN TYPE
# ==============================

@csrf_exempt
def update_loan_type(request):
    if request.method == "POST":
        data = json.loads(request.body)

        lead_id = data.get("id")
        loan_type = data.get("loan_type")

        inquiry = LoanInquiry.objects.get(id=lead_id)

        inquiry.loan_type = loan_type
        inquiry.save()

        return JsonResponse({
            "status": "updated"
        })


# ==============================
# SAVE AGRO INQUIRY
# ==============================

@csrf_exempt
def agro_inquiry(request):
    if request.method == "POST":
        data = json.loads(request.body)

        inquiry = AgriInquiry.objects.create(
            full_name=data.get("full_name"),
            email=data.get("email"),
            mobile=data.get("mobile"),
            product_name=""
        )

        return JsonResponse({
            "status": "success",
            "id": inquiry.id
        })


# ==============================
# UPDATE PRODUCT
# ==============================

@csrf_exempt
def update_product(request):
    if request.method == "POST":
        data = json.loads(request.body)

        agri_id = data.get("id")
        product = data.get("product_name")

        inquiry = AgriInquiry.objects.get(id=agri_id)

        inquiry.product_name = product
        inquiry.save()

        return JsonResponse({
            "status": "updated"
        })


# ==============================
# EMPLOYEE LOGIN (FINAL FIXED ✅)
# ==============================

@csrf_exempt
def employee_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            emp_id = str(data.get("emp_id")).strip()
            password = str(data.get("password")).strip()

            print("INPUT:", emp_id, password)

            # 🔍 Find employee
            emp = Employee.objects.filter(emp_id=emp_id).first()

            if not emp:
                return JsonResponse({
                    "status": "error",
                    "message": "Employee not found"
                })

            # 🔐 Password check
            if emp.password != password:
                return JsonResponse({
                    "status": "error",
                    "message": "Wrong password"
                })

            # 🔥 DEBUG (check values)
            print("EMP DATA:", emp.emp_name, emp.department, emp.designation)

            # ✅ FINAL RESPONSE (FIXED)
            return JsonResponse({
                "status": "success",
                "emp_id": emp.emp_id,
                "name": emp.emp_name,
                "department": emp.department,
                "designation": emp.designation   
            })

        except Exception as e:
            print("ERROR:", e)

            return JsonResponse({
                "status": "error",
                "message": "Server Error"
            })


# ==============================
# GET EMPLOYEES LIST
# ==============================

@csrf_exempt
def get_employees(request):
    if request.method == "GET":
        try:
            employees = Employee.objects.all().values()

            return JsonResponse(list(employees), safe=False)

        except Exception as e:
            print("ERROR:", e)

            return JsonResponse({
                "status": "error",
                "message": "Server Error"
            })