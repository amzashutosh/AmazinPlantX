from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=255)
    subscription_plan = models.CharField(max_length=50, default='BASIC')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Plant(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='plants')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    model_url = models.URLField(blank=True, null=True, help_text="URL to the 3D model (GLTF/GLB)")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.client.name}"
