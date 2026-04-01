from django.db import models


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