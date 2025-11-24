from rest_framework import serializers
from .models import Asset3D

class Asset3DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset3D
        fields = '__all__'
