from django.urls import path
from .views import submit_requirement

urlpatterns = [
    path('submit-requirement/', submit_requirement, name='submit-requirement'),
]