from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, SensorTagViewSet

router = DefaultRouter()
router.register(r'assets', AssetViewSet)
router.register(r'sensor-tags', SensorTagViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
