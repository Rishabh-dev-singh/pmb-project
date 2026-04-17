from django.contrib import admin
from .models import LoanInquiry, AgriInquiry, Attendance


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


# 🔥 NEW ADD THIS
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "emp_id",
        "date",
        "punch_in",
        "punch_out",
        "lunch_start",
        "lunch_end",
    )


admin.site.register(LoanInquiry, LoanInquiryAdmin)
admin.site.register(AgriInquiry, AgriInquiryAdmin)

# 🔥 REGISTER ATTENDANCE
admin.site.register(Attendance, AttendanceAdmin)
