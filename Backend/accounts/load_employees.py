# accounts/load_employees.py
import csv
from accounts.models import CustomUser

def load_data(file_path):
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            user = CustomUser.objects.create_user(
                employee_id=row['employee_id'],
                password=row['password'],
                first_name=row['name'],
                department=row['dept'],
                designation=row['desig']
            )
            print(f"Added: {row['employee_id']}")

