import React, { useEffect, useState } from 'react';
import AssetSidebar from '../components/editor/AssetSidebar';
import SceneCanvas from '../components/editor/SceneCanvas';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import useSceneStore from '../store/sceneStore';
import sceneService from '../services/sceneService';
import { Save, Loader } from 'lucide-react';

const DigitalTwin = () => {
    const { sceneObjects, setObjects } = useSceneStore();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Hardcoded Plant ID for demo. In real app, select from list.
    const PLANT_ID = 1;

    useEffect(() => {
        loadScene();
    }, []);

    const loadScene = async () => {
        setLoading(true);
        try {
            const assets = await sceneService.getPlantAssets(PLANT_ID);

            const formattedAssets = assets.map(a => ({
                id: a.id, // Keep DB ID
                assetId: a.library_asset?.id,
                name: a.name,
                modelUrl: a.library_asset?.file, // Now available due to depth=1
                id: a.id, // Keep DB ID
                assetId: a.library_asset?.id,
                name: a.name,
                modelUrl: a.library_asset?.file, // Now available due to depth=1
                position: [a.position_x, a.position_y, a.position_z],
                rotation: [a.rotation_x, a.rotation_y, a.rotation_z],
                scale: [a.scale_x, a.scale_y, a.scale_z],
                boundDeviceId: a.bound_device?.id,
                telemetryMapping: a.telemetry_mapping,
            }));

            setObjects(formattedAssets);

        } catch (error) {
            console.error("Error loading scene:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await sceneService.saveScene(PLANT_ID, sceneObjects);
            alert('Scene saved successfully!');
        } catch (error) {
            console.error("Error saving scene:", error);
            alert('Failed to save scene.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={styles.toolbar}>
                <h3 style={{ margin: 0, color: '#fff' }}>Digital Twin Editor</h3>
                <button onClick={handleSave} style={styles.saveButton} disabled={saving}>
                    {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Layout
                </button>
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <AssetSidebar />
                <SceneCanvas />
                <PropertiesPanel />
            </div>
        </div>
    );
};

const styles = {
    toolbar: {
        height: '50px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
    },
    saveButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        fontWeight: '500',
    },
};

export default DigitalTwin;
