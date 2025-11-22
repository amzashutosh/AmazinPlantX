from django.contrib import admin
from .models import Client, Plant

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['name', 'subscription_plan', 'created_at']
    search_fields = ['name']

@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'location', 'created_at']
    list_filter = ['client']
    search_fields = ['name', 'location']
