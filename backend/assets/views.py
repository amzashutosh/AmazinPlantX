from rest_framework import viewsets
from .models import Asset, SensorTag
from .serializers import AssetSerializer, SensorTagSerializer

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

class SensorTagViewSet(viewsets.ModelViewSet):
    queryset = SensorTag.objects.all()
    serializer_class = SensorTagSerializer
