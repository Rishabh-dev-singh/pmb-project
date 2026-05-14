# accounts/urls.py
from django.urls import path
from .views import LoginView # Make sure ye import sahi hai

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'), # URL ab ban gaya 'api/login/'
]