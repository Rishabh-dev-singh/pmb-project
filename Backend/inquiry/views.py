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

        print("MAIL ERROR:", e)



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

            send_notification(

                "New Loan Inquiry - PMB Finance",

                f"""

NEW LOAN INQUIRY

Name: {inquiry.full_name}

Mobile: {inquiry.mobile}

Email: {inquiry.email}

                """

            )

            return JsonResponse({

                "status":"success",

                "id": inquiry.id

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message": str(e)

            })


@csrf_exempt
def update_loan_type(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            inquiry = LoanInquiry.objects.get(
                id=data.get("id")
            )

            inquiry.loan_type = data.get(
                "loan_type"
            )

            inquiry.save()

            return JsonResponse({

                "status":"updated"

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message": str(e)

            })


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

            send_notification(

                "New Agriculture Inquiry",

                f"""

NEW AGRI INQUIRY

Name: {inquiry.full_name}

Mobile: {inquiry.mobile}

Email: {inquiry.email}

                """

            )

            return JsonResponse({

                "status":"success",

                "id": inquiry.id

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message": str(e)

            })


@csrf_exempt
def update_product(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            inquiry = AgriInquiry.objects.get(
                id=data.get("id")
            )

            inquiry.product_name = data.get(
                "product_name"
            )

            inquiry.save()

            return JsonResponse({

                "status":"updated"

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message": str(e)

            })


@csrf_exempt
def attendance_api(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            emp_id = data.get("employee_id")

            punch_type = data.get("type")

            time_str = data.get("time")

            date_str = data.get("date")

            emp = CustomUser.objects.get(
                employee_id=emp_id
            )

            today = datetime.strptime(
                date_str,
                "%Y-%m-%d"
            ).date()

            obj, created = Attendance.objects.get_or_create(

                employee=emp,

                date=today

            )

            time_obj = datetime.strptime(

                time_str,

                "%I:%M:%S %p"

            ).time()

            if punch_type=="IN":

                obj.punch_in=time_obj

            elif punch_type=="OUT":

                obj.punch_out=time_obj

            obj.save()

            return JsonResponse({

                "status":"success"

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message":str(e)

            },status=400)

    return JsonResponse({

        "status":"error"

    },status=405)



def get_employees(request):

    employees=list(

        CustomUser.objects.all().values(

            'employee_id',

            'first_name',

            'department',

            'designation'

        )

    )

    return JsonResponse(

        employees,

        safe=False

    )



@csrf_exempt
def lead_list_create(request):

    if request.method=="GET":

        leads=list(

            Lead.objects.all()

            .order_by("-id")

            .values()

        )

        return JsonResponse(

            leads,

            safe=False

        )

    if request.method=="POST":

        try:

            data=json.loads(request.body)

            lead=Lead.objects.create(

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

                nextDate=data.get("nextDate"),

                nextTime=data.get("nextTime"),

                dob=data.get("dob"),

                additional=data.get("additional")

            )

            return JsonResponse({

                "status":"success",

                "id":lead.id

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message":str(e)

            })


@csrf_exempt
def update_lead(request,pk):

    try:

        data=json.loads(request.body)

        lead=Lead.objects.get(id=pk)

        lead.fullName=data.get(
            "fullName",
            lead.fullName
        )

        lead.mobile=data.get(
            "mobile",
            lead.mobile
        )

        lead.save()

        return JsonResponse({

            "status":"success"

        })

    except Exception as e:

        return JsonResponse({

            "status":"error",

            "message":str(e)

        })


@csrf_exempt
def delete_lead(request,pk):

    try:

        Lead.objects.get(
            id=pk
        ).delete()

        return JsonResponse({

            "status":"deleted"

        })

    except Exception as e:

        return JsonResponse({

            "status":"error",

            "message":str(e)

        })



@csrf_exempt
def save_software_inquiry(request):

    if request.method=="POST":

        try:

            data=json.loads(request.body)

            inquiry=SoftwareInquiry.objects.create(

                full_name=data.get("full_name"),

                email=data.get("email"),

                mobile=data.get("mobile"),

                service_type=data.get(
                    "service_type"
                )

            )

            send_notification(

                "New Software Inquiry",

                f"""

NEW SOFTWARE INQUIRY

Name: {inquiry.full_name}

Mobile: {inquiry.mobile}

Email: {inquiry.email}

Service: {inquiry.service_type}

                """

            )

            return JsonResponse({

                "status":"success",

                "id": inquiry.id

            })

        except Exception as e:

            return JsonResponse({

                "status":"error",

                "message":str(e)

            })