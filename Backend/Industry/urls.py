from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LabourRequirementViewSet

router = DefaultRouter()
router.register(r'submit-requirement', LabourRequirementViewSet, basename='submit-requirement')

urlpatterns = [
    path('', include(router.urls)),
]