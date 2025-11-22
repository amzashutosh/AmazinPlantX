import React from 'react';
import SceneViewer from '../components/3d/SceneViewer';
import TagMarker from '../components/3d/TagMarker';

const DigitalTwin = () => {
    return (
        <div style={{ height: 'calc(100vh - 100px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <SceneViewer>
                {/* Dummy Machine Model (Box) */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[2, 1, 1]} />
                    <meshStandardMaterial color="#475569" />
                </mesh>

                {/* Sensor Tags */}
                <TagMarker
                    position={[0.5, 1, 0.5]}
                    label="Motor Temp"
                    value="65.4"
                    unit="°C"
                    status="normal"
                />
                <TagMarker
                    position={[-0.5, 0.8, 0.5]}
                    label="Vibration X"
                    value="2.1"
                    unit="mm/s"
                    status="warning"
                />
            </SceneViewer>
        </div>
    );
};

export default DigitalTwin;
