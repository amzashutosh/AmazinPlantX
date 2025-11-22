import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';

const SceneViewer = ({ children }) => {
    return (
        <div style={{ width: '100%', height: '100%', background: '#0f172a' }}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    {/* Grid for context */}
                    <Grid infiniteGrid fadeDistance={30} sectionColor="#38bdf8" cellColor="#1e293b" />

                    {/* Environment */}
                    <Environment preset="city" />

                    {/* Content */}
                    {children}

                    <OrbitControls makeDefault />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default SceneViewer;
