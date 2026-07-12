from django.db import models
from django.conf import settings
#  LoanInquiry Model
class LoanInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    loan_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
# AgriInquiry Model
class AgriInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    product_name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
# Attendance Model
class Attendance(models.Model):
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    punch_in = models.TimeField(null=True, blank=True)
    punch_out = models.TimeField(null=True, blank=True)
    lunch_start = models.TimeField(null=True, blank=True)
    lunch_end = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.employee} - {self.date}"
# Lead Model
class Lead(models.Model):
    prospectType = models.CharField(max_length=50)
    loanType = models.CharField(max_length=50)
    salutation = models.CharField(max_length=10)
    fullName = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15)
    requiredLoanAmount = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    owner = models.CharField(max_length=100)
    bankName = models.CharField(max_length=200, blank=True, null=True)
    rmName = models.CharField(max_length=200, blank=True, null=True)
    progress = models.CharField(max_length=50)
    source = models.CharField(max_length=100, blank=True, null=True)
    subSource = models.CharField(max_length=100, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    nextDate = models.DateField(blank=True, null=True)
    nextTime = models.TimeField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    additional = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fullName} ({self.mobile})"
# SoftwareInquiry Model
class SoftwareInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    service_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.service_type}"

#  Productivity Model
class Productivity(models.Model):
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    total_calls = models.PositiveIntegerField(default=0)
    connected_calls = models.PositiveIntegerField(default=0)
    
    # Text fields ke liye Multiline support
    interested_customers = models.TextField(blank=True, null=True, help_text="Format: 1) Name 2) Name")
    followup_customers = models.TextField(blank=True, null=True, help_text="Format: 1) Name 2) Name")
    
    remark = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date'] 
        verbose_name_plural = "Productivity Reports"

    def __str__(self):
        return f"{self.employee.username} - {self.date}"
    

  