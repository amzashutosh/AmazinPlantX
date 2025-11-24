import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from tenants.models import Client, Plant
from library.models import Asset3D
from django.core.files.base import ContentFile

def seed():
    print("Seeding data...")

    # 1. Create Client
    client, created = Client.objects.get_or_create(name="Acme Corp")
    if created:
        print(f"Created Client: {client.name}")
    else:
        print(f"Client exists: {client.name}")

    # 2. Create Plant
    plant, created = Plant.objects.get_or_create(
        name="Main Factory",
        client=client,
        defaults={'location': 'New York'}
    )
    if created:
        print(f"Created Plant: {plant.name} (ID: {plant.id})")
    else:
        print(f"Plant exists: {plant.name} (ID: {plant.id})")

    # 3. Create a Dummy 3D Asset (Cube) if none exist
    if not Asset3D.objects.exists():
        print("Creating dummy 3D assets...")
        # We can't easily create a real .glb file here, but we can create the record.
        # The frontend might fail to load the URL if it's empty, but at least the list will populate.
        # Ideally user should upload one.
        Asset3D.objects.create(
            name="Generic Machine",
            category="MACHINE",
            default_scale=1.0
        )
        Asset3D.objects.create(
            name="Safety Fence",
            category="INFRASTRUCTURE",
            default_scale=1.0
        )
        print("Created dummy Asset3D records. Please upload real .glb files via the UI.")
    else:
        print("Asset3D library already has items.")

    print("Seeding complete!")

if __name__ == '__main__':
    seed()
