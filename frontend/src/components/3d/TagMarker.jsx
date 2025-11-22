import React, { useState } from 'react';
import { Html } from '@react-three/drei';

const TagMarker = ({ position, label, value, unit, status = 'normal' }) => {
    const [hovered, setHovered] = useState(false);

    const getColor = () => {
        switch (status) {
            case 'warning': return '#f59e0b'; // Amber
            case 'critical': return '#ef4444'; // Red
            default: return '#22c55e'; // Green
        }
    };

    return (
        <group position={position}>
            {/* 3D Dot */}
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color={getColor()} />
            </mesh>

            {/* HTML Label */}
            <Html distanceFactor={10}>
                <div style={{
                    ...styles.tag,
                    borderColor: getColor(),
                    opacity: hovered ? 1 : 0.8,
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                }}>
                    <div style={styles.header}>
                        <span style={styles.label}>{label}</span>
                        <span style={{ ...styles.statusDot, backgroundColor: getColor() }} />
                    </div>
                    <div style={styles.value}>
                        {value} <span style={styles.unit}>{unit}</span>
                    </div>
                </div>
            </Html>
        </group>
    );
};

const styles = {
    tag: {
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '2px solid',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        minWidth: '100px',
        pointerEvents: 'none', // Let clicks pass through to 3D object if needed
        transition: 'all 0.2s',
        userSelect: 'none',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
    },
    label: {
        fontSize: '10px',
        textTransform: 'uppercase',
        color: '#94a3b8',
        fontWeight: 'bold',
    },
    statusDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
    },
    value: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    unit: {
        fontSize: '12px',
        color: '#cbd5e1',
        fontWeight: 'normal',
    }
};

export default TagMarker;
