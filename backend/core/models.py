from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        CLIENT_ADMIN = 'CLIENT_ADMIN', 'Client Admin'
        PLANT_MANAGER = 'PLANT_MANAGER', 'Plant Manager'
        OPERATOR = 'OPERATOR', 'Operator'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.OPERATOR)
    client = models.ForeignKey('tenants.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return f"{self.username} ({self.role})"
