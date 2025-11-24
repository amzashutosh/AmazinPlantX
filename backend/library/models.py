from django.db import models

class Asset3D(models.Model):
    CATEGORY_CHOICES = [
        ('MACHINE', 'Machine'),
        ('SENSOR', 'Sensor'),
        ('INFRASTRUCTURE', 'Infrastructure'),
        ('OTHER', 'Other'),
    ]

    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='3d_models/')
    thumbnail = models.ImageField(upload_to='3d_thumbnails/', blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    default_scale = models.FloatField(default=1.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
