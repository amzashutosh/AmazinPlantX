from rest_framework import viewsets, parsers
from .models import Asset3D
from .serializers import Asset3DSerializer

class Asset3DViewSet(viewsets.ModelViewSet):
    queryset = Asset3D.objects.all()
    serializer_class = Asset3DSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
