from django.contrib import admin

from .models import LoanInquiry, AgriInquiry



class LoanInquiryAdmin(admin.ModelAdmin):

    list_display = (

        "full_name",

        "email",

        "mobile",

        "loan_type",

        "created_at"

    )



class AgriInquiryAdmin(admin.ModelAdmin):

    list_display = (

        "full_name",

        "email",

        "mobile",

        "product_name",

        "created_at"

    )



admin.site.register(LoanInquiry, LoanInquiryAdmin)

admin.site.register(AgriInquiry, AgriInquiryAdmin)