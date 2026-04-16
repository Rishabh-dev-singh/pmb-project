from django.contrib import admin
from django.urls import path
from inquiry import views

urlpatterns = [

    path('admin/', admin.site.urls),

    # Loan APIs
    path('api/inquiry/', views.save_inquiry),
    path('api/update-loan-type/', views.update_loan_type),

    # Agro APIs
    path('api/agro-inquiry/', views.agro_inquiry),
    path('api/update-product/', views.update_product),

    # Employee APIs
    path('api/login/', views.employee_login),
    path('api/employees/', views.get_employees),
]
from django.contrib import admin
from django.urls import path
from inquiry import views

urlpatterns = [

    path('admin/', admin.site.urls),

    # ==============================
    # LOAN APIs
    # ==============================
    path('api/inquiry/', views.save_inquiry),
    path('api/update-loan-type/', views.update_loan_type),

    # ==============================
    # AGRO APIs
    # ==============================
    path('api/agro-inquiry/', views.agro_inquiry),
    path('api/update-product/', views.update_product),

    # ==============================
    # EMPLOYEE APIs
    # ==============================
    path('api/login/', views.employee_login),
    path('api/employees/', views.get_employees),

    # ==============================
    # ATTENDANCE API 🔥 (IMPORTANT)
    # ==============================
    path('api/attendance/', views.attendance_api),
]