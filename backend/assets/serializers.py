from rest_framework import serializers
from .models import Asset, SensorTag

class SensorTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorTag
        fields = '__all__'

class AssetSerializer(serializers.ModelSerializer):
    sensor_tags = SensorTagSerializer(many=True, read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'
        depth = 1

