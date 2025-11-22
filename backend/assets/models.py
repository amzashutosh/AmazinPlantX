from django.db import models
from tenants.models import Plant

class Asset(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='assets')
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.plant.name})"

class SensorTag(models.Model):
    class SensorType(models.TextChoices):
        TEMPERATURE = 'TEMPERATURE', 'Temperature'
        VIBRATION = 'VIBRATION', 'Vibration'
        OTHER = 'OTHER', 'Other'

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='sensor_tags')
    sensor_id = models.CharField(max_length=100, help_text="External Sensor ID")
    sensor_type = models.CharField(max_length=20, choices=SensorType.choices, default=SensorType.OTHER)
    
    # 3D Position
    position_x = models.FloatField(default=0.0)
    position_y = models.FloatField(default=0.0)
    position_z = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.sensor_id} - {self.asset.name}"
