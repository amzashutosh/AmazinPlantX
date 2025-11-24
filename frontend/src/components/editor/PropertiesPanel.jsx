import React, { useEffect, useState } from 'react';
import useSceneStore from '../../store/sceneStore';
import deviceService from '../../services/deviceService';
import { Settings, Link as LinkIcon, Save } from 'lucide-react';

const PropertiesPanel = () => {
    const { selectedObjectId, sceneObjects, updateObjectTransform } = useSceneStore();
    const [devices, setDevices] = useState([]);

    const selectedObject = sceneObjects.find(obj => obj.id === selectedObjectId);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const data = await deviceService.getAllDevices();
                setDevices(data);
            } catch (error) {
                console.error("Failed to load devices", error);
            }
        };
        fetchDevices();
    }, []);

    if (!selectedObject) {
        return (
            <div style={styles.panel}>
                <div style={styles.emptyState}>
                    <p>Select an object to view properties</p>
                </div>
            </div>
        );
    }

    const handleTransformChange = (axis, value, type) => {
        const newTransform = { ...selectedObject[type] };
        // This is a bit complex because position/rotation are arrays [x, y, z]
        // But the store expects the full array.
        // Let's simplify: type is 'position', 'rotation', or 'scale'
        // value is the new value for the specific axis index (0=x, 1=y, 2=z)

        const currentArray = [...selectedObject[type]];
        currentArray[axis] = parseFloat(value);

        updateObjectTransform(selectedObjectId, { [type]: currentArray });
    };

    const handleBindDevice = (deviceId) => {
        updateObjectTransform(selectedObjectId, { boundDeviceId: deviceId });
    };

    const handleMappingChange = (property, key) => {
        const currentMapping = selectedObject.telemetryMapping || {};
        const newMapping = { ...currentMapping, [property]: key };
        // Remove empty keys
        if (!key) delete newMapping[property];

        updateObjectTransform(selectedObjectId, { telemetryMapping: newMapping });
    };

    return (
        <div style={styles.panel}>
            <h3 style={styles.title}>Properties</h3>

            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Transform</h4>
                {['position', 'rotation', 'scale'].map(type => (
                    <div key={type} style={styles.transformGroup}>
                        <label style={styles.label}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                        <div style={styles.inputRow}>
                            {['X', 'Y', 'Z'].map((axis, index) => (
                                <div key={axis} style={styles.inputWrapper}>
                                    <span style={styles.axisLabel}>{axis}</span>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={selectedObject[type][index]}
                                        onChange={(e) => handleTransformChange(index, e.target.value, type)}
                                        style={styles.input}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>
                    <LinkIcon size={16} /> Data Binding
                </h4>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Bind to Device</label>
                    <select
                        value={selectedObject.boundDeviceId || ''}
                        onChange={(e) => handleBindDevice(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">-- None --</option>
                        {devices.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                {selectedObject.boundDeviceId && (
                    <div style={styles.mappingContainer}>
                        <label style={styles.label}>Telemetry Mapping</label>
                        <p style={styles.hint}>Map 3D properties to JSON keys from the device.</p>

                        <div style={styles.mappingRow}>
                            <span style={styles.propLabel}>Rotation Y (RPM)</span>
                            <input
                                type="text"
                                placeholder="e.g. rpm"
                                value={selectedObject.telemetryMapping?.['rotation_y'] || ''}
                                onChange={(e) => handleMappingChange('rotation_y', e.target.value)}
                                style={styles.mappingInput}
                            />
                        </div>
                        <div style={styles.mappingRow}>
                            <span style={styles.propLabel}>Color (Status)</span>
                            <input
                                type="text"
                                placeholder="e.g. status"
                                value={selectedObject.telemetryMapping?.['color'] || ''}
                                onChange={(e) => handleMappingChange('color', e.target.value)}
                                style={styles.mappingInput}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    panel: {
        width: '280px',
        backgroundColor: '#1e293b',
        borderLeft: '1px solid #334155',
        padding: '1rem',
        overflowY: 'auto',
        color: '#fff',
    },
    emptyState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#94a3b8',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #334155',
        paddingBottom: '0.5rem',
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '0.9rem',
        fontWeight: '600',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#cbd5e1',
    },
    transformGroup: {
        marginBottom: '1rem',
    },
    label: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: '0.5rem',
        display: 'block',
    },
    inputRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    inputWrapper: {
        flex: 1,
        position: 'relative',
    },
    axisLabel: {
        position: 'absolute',
        left: '0.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '0.7rem',
        color: '#64748b',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '0.25rem 0.25rem 0.25rem 1.25rem',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '0.25rem',
        color: '#fff',
        fontSize: '0.8rem',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    select: {
        width: '100%',
        padding: '0.5rem',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '0.25rem',
        color: '#fff',
    },
    mappingContainer: {
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        padding: '0.75rem',
        borderRadius: '0.5rem',
    },
    hint: {
        fontSize: '0.75rem',
        color: '#64748b',
        marginBottom: '0.75rem',
    },
    mappingRow: {
        marginBottom: '0.75rem',
    },
    propLabel: {
        fontSize: '0.8rem',
        color: '#cbd5e1',
        display: 'block',
        marginBottom: '0.25rem',
    },
    mappingInput: {
        width: '100%',
        padding: '0.35rem',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '0.25rem',
        color: '#a5b4fc',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
    },
};

export default PropertiesPanel;
