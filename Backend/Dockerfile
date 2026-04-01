# Python base image
FROM python:3.11

# Server ke andar folder ka naam
WORKDIR /app

# Dependencies copy aur install karna
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Baaki saara code copy karna
COPY . .

# Django server start karna
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]