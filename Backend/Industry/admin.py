from django.contrib import admin
from .models import LabourRequirement

@admin.register(LabourRequirement)
class LabourRequirementAdmin(admin.ModelAdmin):
    list_display = (
        'company_name', 
        'full_name', 
        'required_role', 
        'headcount', 
        'deployment_date', 
        'status'
    )
    
    list_filter = ('status', 'industry_sector', 'deployment_date')
    
    search_fields = ('company_name', 'full_name', 'mobile', 'email')
    
    list_editable = ('status',)
    
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Customer Info', {
            'fields': ('full_name', 'mobile', 'email')
        }),
        ('Company Details', {
            'fields': ('company_name', 'company_address')
        }),
        ('Work Requirement', {
            'fields': ('industry_sector', 'required_role', 'headcount', 'deployment_date', 'status')
        }),
    )