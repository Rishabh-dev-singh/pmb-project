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

]