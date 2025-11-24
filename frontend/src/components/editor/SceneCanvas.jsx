import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import useSceneStore from '../../store/sceneStore';
import DraggableAsset from './DraggableAsset';

const SceneCanvas = () => {
    const { sceneObjects, addObject, selectObject } = useSceneStore();

    const handleDrop = (e) => {
        e.preventDefault();
        const assetData = e.dataTransfer.getData('application/json');
        if (assetData) {
            const asset = JSON.parse(assetData);
            addObject(asset);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div
            style={{ flex: 1, position: 'relative', backgroundColor: '#0f172a' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <Environment preset="city" />

                    <Grid infiniteGrid fadeDistance={50} sectionColor="#475569" cellColor="#1e293b" />

                    {sceneObjects.map((obj) => (
                        <DraggableAsset key={obj.id} object={obj} />
                    ))}

                    <OrbitControls makeDefault onClick={() => selectObject(null)} />
                </Suspense>
            </Canvas>

            <div style={styles.instructions}>
                Drag assets from the sidebar to place them. Click to select and move.
            </div>
        </div>
    );
};

const styles = {
    instructions: {
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        pointerEvents: 'none',
        fontSize: '0.9rem',
    }
};

export default SceneCanvas;
