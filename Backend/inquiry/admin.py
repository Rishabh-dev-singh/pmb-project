from django.contrib import admin
from .models import LoanInquiry, AgriInquiry, Attendance, Lead, SoftwareInquiry

@admin.register(LoanInquiry)
class LoanInquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "mobile", "loan_type", "created_at")
    list_filter = ("loan_type", "created_at")
    search_fields = ("full_name", "mobile")

@admin.register(AgriInquiry)
class AgriInquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "mobile", "product_name", "created_at")
    list_filter = ("product_name", "created_at")
    search_fields = ("full_name", "product_name")

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("employee", "date", "punch_in", "punch_out", "lunch_start", "lunch_end")
    list_filter = ("date", "employee")
    search_fields = ("employee__username",)
    date_hierarchy = 'date'

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    # ADMIN PANEL MEIN BHI BANK AUR RM DIKHEGA
    list_display = (
        "fullName", "mobile", "loanType", 
        "requiredLoanAmount", "location", "bankName", "rmName",
        "owner", "progress", "created_at"
    )
    list_filter = ("progress", "loanType", "owner", "bankName")
    search_fields = ("fullName", "mobile", "location", "bankName", "rmName")
    list_editable = ("progress", "owner")
    date_hierarchy = 'created_at'

@admin.register(SoftwareInquiry)
class SoftwareInquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "mobile", "service_type", "created_at")
    list_filter = ("service_type", "created_at")
    search_fields = ("full_name", "mobile", "service_type")
    date_hierarchy = 'created_at'