from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet, TelemetryView

router = DefaultRouter()
router.register(r'devices', DeviceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('telemetry/', TelemetryView.as_view(), name='telemetry'),
]
