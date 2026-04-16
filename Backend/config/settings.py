import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# 🔐 SECRET KEY (env se lo)
SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret')

# ❌ DEBUG off
DEBUG = False

# 🌐 ALLOWED HOSTS
ALLOWED_HOSTS = ['pmb.finance', 'www.pmb.finance']


# ==============================
# INSTALLED APPS
# ==============================
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


# ==============================
# MIDDLEWARE
# ==============================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    
    # 🔥 add this for static (important)
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]


ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'


# ==============================
# DATABASE
# ==============================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pmb_db',
        'USER': 'postgres',
        'PASSWORD': os.environ.get('DB_PASSWORD', 'your_password'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


# ==============================
# STATIC FILES
# ==============================
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# 🔥 whitenoise config
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# ==============================
# SECURITY (IMPORTANT 🔥)
# ==============================
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# HTTPS force (agar SSL hai)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


# ==============================
# CORS
# ==============================
CORS_ALLOW_ALL_ORIGINS = False  # ❌ sabko allow mat karo

CORS_ALLOWED_ORIGINS = [
    "https://pmb.finance",
    "https://www.pmb.finance"
]


# ==============================
# CSRF
# ==============================
CSRF_TRUSTED_ORIGINS = [
    'https://pmb.finance',
    'https://www.pmb.finance'
]