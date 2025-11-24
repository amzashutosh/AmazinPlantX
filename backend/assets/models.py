from django.db import models
from tenants.models import Plant
from library.models import Asset3D
from devices.models import Device

class Asset(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='assets')
    library_asset = models.ForeignKey(Asset3D, on_delete=models.SET_NULL, null=True, blank=True, related_name='instances')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    
    # 3D Transform
    position_x = models.FloatField(default=0.0)
    position_y = models.FloatField(default=0.0)
    position_z = models.FloatField(default=0.0)
    
    rotation_x = models.FloatField(default=0.0)
    rotation_y = models.FloatField(default=0.0)
    rotation_z = models.FloatField(default=0.0)
    
    scale_x = models.FloatField(default=1.0)
    scale_y = models.FloatField(default=1.0)
    scale_z = models.FloatField(default=1.0)
    
    # Connectivity
    bound_device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True, related_name='bound_assets')
    telemetry_mapping = models.JSONField(default=dict, blank=True, help_text="Map 3D props to telemetry keys. e.g. {'rotation_y': 'rpm'}")

    # Configuration (e.g. specific settings for this instance)
    configuration = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.name} ({self.plant.name})"

class SensorTag(models.Model):
    """
    Legacy/Specific sensor points on an asset.
    Can be used to map specific telemetry keys to 3D positions relative to the Asset.
    """
    class SensorType(models.TextChoices):
        TEMPERATURE = 'TEMPERATURE', 'Temperature'
        VIBRATION = 'VIBRATION', 'Vibration'
        OTHER = 'OTHER', 'Other'

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='sensor_tags')
    sensor_id = models.CharField(max_length=100, help_text="External Sensor ID")
    sensor_type = models.CharField(max_length=20, choices=SensorType.choices, default=SensorType.OTHER)
    
    # 3D Position (Relative to Asset)
    position_x = models.FloatField(default=0.0)
    position_y = models.FloatField(default=0.0)
    position_z = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.sensor_id} - {self.asset.name}"
