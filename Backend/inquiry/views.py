import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings

from .models import (
    LoanInquiry,
    AgriInquiry,
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

        return True

    except Exception as e:

        print("MAIL ERROR:", e)

        return False


@csrf_exempt
def save_inquiry(request):

    if request.method != "POST":

        return JsonResponse(
            {"status":"error"},
            status=405
        )

    try:

        data=json.loads(request.body)

        inquiry=LoanInquiry.objects.create(

            full_name=data.get("full_name"),

            email=data.get("email"),

            mobile=data.get("mobile"),

            loan_type=data.get("loan_type","")

        )

        body=f"""

NEW LOAN INQUIRY

Name: {inquiry.full_name}

Mobile: {inquiry.mobile}

Email: {inquiry.email}

Loan Type: {inquiry.loan_type}

"""

        mail_sent=send_notification(

            "New Loan Inquiry - PMB Finance",

            body

        )

        return JsonResponse({

            "status":"success",

            "id":inquiry.id,

            "mail_sent":mail_sent

        })


    except Exception as e:

        return JsonResponse({

            "status":"error",

            "message":str(e)

        })



@csrf_exempt
def agro_inquiry(request):

    if request.method!="POST":

        return JsonResponse(
            {"status":"error"},
            status=405
        )

    try:

        data=json.loads(request.body)

        inquiry=AgriInquiry.objects.create(

            full_name=data.get("full_name"),

            email=data.get("email"),

            mobile=data.get("mobile"),

            product_name=data.get("product_name","")

        )

        body=f"""

NEW AGRICULTURE INQUIRY

Name: {inquiry.full_name}

Mobile: {inquiry.mobile}

Email: {inquiry.email}

Product: {inquiry.product_name}

"""

        mail_sent=send_notification(

            "New Agriculture Inquiry",

            body

        )

        return JsonResponse({

            "status":"success",

            "id":inquiry.id,

            "mail_sent":mail_sent

        })


    except Exception as e:

        return JsonResponse({

            "status":"error",

            "message":str(e)

        })



@csrf_exempt
def save_software_inquiry(request):

    if request.method!="POST":

        return JsonResponse(
            {"status":"error"},
            status=405
        )

    try:

        data=json.loads(request.body)

        inquiry=SoftwareInquiry.objects.create(

            full_name=data.get("full_name"),

            email=data.get("email"),

            mobile=data.get("mobile"),

            service_type=data.get("service_type","")

        )

        body=f"""

NEW SOFTWARE INQUIRY

Name: {inquiry.full_name}

Mobile: {inquiry.mobile}

Email: {inquiry.email}

Service: {inquiry.service_type}

"""

        mail_sent=send_notification(

            "New Software Inquiry",

            body

        )

        return JsonResponse({

            "status":"success",

            "id":inquiry.id,

            "mail_sent":mail_sent

        })


    except Exception as e:

        return JsonResponse({

            "status":"error",

            "message":str(e)

        })