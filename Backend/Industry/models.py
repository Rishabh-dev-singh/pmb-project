from django.db import models

INDUSTRY_CHOICES = [
    ("Garments & Textiles", "Garments & Textiles"),
    ("Gems & Jewellery", "Gems & Jewellery"),
    ("Handicrafts & Wooden Furniture", "Handicrafts & Wooden Furniture"),
    ("Stone Processing & Marble", "Stone Processing & Marble"),
    ("Auto Parts & Engineering", "Auto Parts & Engineering"),
    ("Food Processing & Agro", "Food Processing & Agro"),
    ("Packaging & Paper", "Packaging & Paper"),
    ("IT & Software Services", "IT & Software Services"),
    ("Manufacturing (Other)", "Manufacturing (Other)"),
]

WORKER_CHOICES = [
    ("Helper / General Labour", "Helper / General Labour"),
    ("Machine Operator", "Machine Operator"),
    ("Tailor / Stitching Master", "Tailor / Stitching Master"),
    ("Artisan / Craftsman", "Artisan / Craftsman"),
    ("Welder / Fitter", "Welder / Fitter"),
    ("Electrician / Plumber", "Electrician / Plumber"),
    ("Store Keeper / Inventory Manager", "Store Keeper / Inventory Manager"),
    ("Supervisor / Shift Incharge", "Supervisor / Shift Incharge"),
    ("Accountant / Cashier", "Accountant / Cashier"),
    ("Sales & Marketing Executive", "Sales & Marketing Executive"),
    ("Office Admin / Manager", "Office Admin / Manager"),
    ("Security Guard", "Security Guard"),
    ("Driver / Delivery Executive", "Driver / Delivery Executive"),
]

class LabourRequirement(models.Model):
    # Contact Information
    full_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    
    # Company Information
    company_name = models.CharField(max_length=255)
    company_address = models.TextField()
    
    # Requirement Details
    industry_sector = models.CharField(max_length=100, choices=INDUSTRY_CHOICES)
    required_role = models.CharField(max_length=100, choices=WORKER_CHOICES)
    headcount = models.PositiveIntegerField()
    deployment_date = models.DateField()
    
    # System Tracking & Management
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=50, 
        choices=[
            ('Pending', 'Pending'), 
            ('Accepted', 'Accepted'), 
            ('Request Completed', 'Request Completed'), 
            ('Payment Accepted', 'Payment Accepted')
        ],
        default='Pending'
    )
    accepted_by = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.company_name} - {self.required_role} ({self.headcount})"

    class Meta:
        verbose_name = "Labour Requirement"
        verbose_name_plural = "Labour Requirements"