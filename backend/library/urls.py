from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Asset3DViewSet

router = DefaultRouter()
router.register(r'assets', Asset3DViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
