from django.db import models

# ==============================
# LOAN INQUIRY
# ==============================
class LoanInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    loan_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


# ==============================
# AGRO INQUIRY
# ==============================
class AgriInquiry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    product_name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


# ==============================
# EMPLOYEE MODEL
# ==============================
class Employee(models.Model):
    emp_id = models.CharField(max_length=10, primary_key=True)
    emp_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100, null=True, blank=True)
    department = models.CharField(max_length=50, null=True, blank=True)
    designation = models.CharField(max_length=50, null=True, blank=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "employees"
        managed = False  

    def __str__(self):
        return self.emp_name


# ==============================
# ATTENDANCE MODEL (SEPARATE)
# ==============================
class Attendance(models.Model):
    emp_id = models.CharField(max_length=10)
    date = models.DateField(auto_now_add=True)

    punch_in = models.TimeField(null=True, blank=True)
    punch_out = models.TimeField(null=True, blank=True)

    lunch_start = models.TimeField(null=True, blank=True)
    lunch_end = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.emp_id} - {self.date}"