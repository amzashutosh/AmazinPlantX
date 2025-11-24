from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Asset, SensorTag
from .serializers import AssetSerializer, SensorTagSerializer
from tenants.models import Plant

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    @action(detail=False, methods=['post'])
    def save_scene(self, request):
        """
        Bulk save assets for a plant.
        Expects: { "plant_id": 1, "assets": [ ... ] }
        """
        plant_id = request.data.get('plant_id')
        assets_data = request.data.get('assets', [])

        if not plant_id:
            return Response({"error": "plant_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plant = Plant.objects.get(id=plant_id)
        except Plant.DoesNotExist:
            return Response({"error": "Plant not found"}, status=status.HTTP_404_NOT_FOUND)

        # Strategy: Delete existing assets for this plant and recreate them (Simplest for sync)
        # In a real app, we might want to diff and update.
        # For now, let's keep it simple: Wipe and Replace (except maybe we want to keep history? No, just current state)
        
        # WARNING: This deletes all assets for the plant!
        # Ideally we should match by ID if provided.
        
        # Let's try a smarter approach:
        # If ID is present, update. If not, create.
        # IDs not in the list but in DB for this plant? Delete them.
        
        incoming_ids = [a.get('id') for a in assets_data if a.get('id')]
        Asset.objects.filter(plant=plant).exclude(id__in=incoming_ids).delete()

        saved_assets = []
        for asset_data in assets_data:
            asset_id = asset_data.get('id')
            
            # Extract fields
            defaults = {
                'name': asset_data.get('name', 'Untitled'),
                'library_asset_id': asset_data.get('assetId'), # Maps to library_asset
                'position_x': asset_data.get('position', [0,0,0])[0],
                'position_y': asset_data.get('position', [0,0,0])[1],
                'position_z': asset_data.get('position', [0,0,0])[2],
                'rotation_x': asset_data.get('rotation', [0,0,0])[0],
                'rotation_y': asset_data.get('rotation', [0,0,0])[1],
                'rotation_z': asset_data.get('rotation', [0,0,0])[2],
                'scale_x': asset_data.get('scale', [1,1,1])[0],
                'scale_y': asset_data.get('scale', [1,1,1])[1],
                'scale_z': asset_data.get('scale', [1,1,1])[2],
                'plant': plant,
                'bound_device_id': asset_data.get('boundDeviceId'),
                'telemetry_mapping': asset_data.get('telemetryMapping', {})
            }

            if asset_id:
                asset_obj, created = Asset.objects.update_or_create(id=asset_id, defaults=defaults)
            else:
                asset_obj = Asset.objects.create(**defaults)
            
            saved_assets.append(asset_obj)

        serializer = AssetSerializer(saved_assets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SensorTagViewSet(viewsets.ModelViewSet):
    queryset = SensorTag.objects.all()
    serializer_class = SensorTagSerializer
