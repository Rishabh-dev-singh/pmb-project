from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from inquiry import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('accounts.urls')),

    path('api/inquiry/', views.save_inquiry),
    path('api/update-loan-type/', views.update_loan_type),

    path('api/agro-inquiry/', views.agro_inquiry),
    path('api/update-product/', views.update_product),

    path('api/software-inquiry/', views.save_software_inquiry),

    path('api/employees/', views.get_employees),

    path('api/attendance/', views.attendance_api),

    path('api/leads/', views.lead_list_create),

    path(
        'api/leads/<int:pk>/update/',
        views.update_lead,
        name='update_lead'
    ),

    path(
        'api/leads/<int:pk>/delete/',
        views.delete_lead,
        name='delete_lead'
    ),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)