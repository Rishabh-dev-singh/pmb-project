from django.db import models
from django.conf import settings  # CustomUser ko link karne ke liye


class LoanInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    loan_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name



class AgriInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    product_name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name




class Attendance(models.Model):
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    punch_in = models.TimeField(null=True, blank=True)
    punch_out = models.TimeField(null=True, blank=True)

    lunch_start = models.TimeField(null=True, blank=True)
    lunch_end = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date}"



class Lead(models.Model):
    prospectType = models.CharField(max_length=50)
    loanType = models.CharField(max_length=50)
    salutation = models.CharField(max_length=10)

    fullName = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15)

    requiredLoanAmount = models.CharField(max_length=50)
    location = models.CharField(max_length=200)

    owner = models.CharField(max_length=100)
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