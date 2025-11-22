from django.contrib import admin
from .models import Asset, SensorTag

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ['name', 'plant', 'asset_type']
    list_filter = ['plant']
    search_fields = ['name']

@admin.register(SensorTag)
class SensorTagAdmin(admin.ModelAdmin):
    list_display = ['sensor_id', 'asset', 'sensor_type', 'position_x', 'position_y', 'position_z']
    list_filter = ['sensor_type', 'asset__plant']
    search_fields = ['sensor_id']
