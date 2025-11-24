from django.db import models
import uuid
from tenants.models import Client

class Device(models.Model):
    tenant = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='devices')
    name = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=255, unique=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    latest_telemetry = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"
