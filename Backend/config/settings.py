import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-change-this-key'

DEBUG = True

# --- UPDATE: Domains add kiye gaye hain ---
ALLOWED_HOSTS = ['pmb.finance', 'www.pmb.finance', '187.127.143.21', 'localhost', '127.0.0.1']


# APPLICATIONS
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'inquiry',
]

# MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Ye sabse upar hona chahiye
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

# TEMPLATES (As it is)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# DATABASE (As it is - rishabh123 password ke saath)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pmb_db',
        'USER': 'postgres',
        'PASSWORD': 'rishabh123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# PASSWORD VALIDATION (As it is)
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator' },
]

# LANGUAGE (As it is)
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# STATIC FILES
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# --- UPDATE: Ye section sabse zaruri hai connection ke liye ---

CORS_ALLOW_ALL_ORIGINS = True  # React se connect karne ke liye
CORS_ALLOW_CREDENTIALS = True

# 400 Bad Request error ko khatam karne ke liye ye zaruri hai
CSRF_TRUSTED_ORIGINS = [
    'http://pmb.finance',
    'http://www.pmb.finance',
    'http://187.127.143.21'
]