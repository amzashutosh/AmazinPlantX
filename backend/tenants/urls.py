from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, PlantViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'plants', PlantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
