import React, { useState, useEffect } from 'react';
import deviceService from '../services/deviceService';
import { Plus, Trash2, Copy, Cpu, Activity } from 'lucide-react';

const DeviceManager = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        tenant: 1 // Hardcoded for now, should be dynamic based on user context
    });

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const data = await deviceService.getAllDevices();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await deviceService.createDevice(formData);
            setShowModal(false);
            fetchDevices();
            setFormData({ name: '', serial_number: '', tenant: 1 });
        } catch (error) {
            console.error('Error creating device:', error);
            alert('Failed to create device. Serial number must be unique.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this device?')) {
            try {
                await deviceService.deleteDevice(id);
                fetchDevices();
            } catch (error) {
                console.error('Error deleting device:', error);
            }
        }
    };

    const handleCopyToken = (token) => {
        deviceService.copyToken(token);
        alert('Token copied to clipboard!');
    };

    if (loading) return <div style={styles.loading}>Loading Devices...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Device Registry</h2>
                <button onClick={() => setShowModal(true)} style={styles.addButton}>
                    <Plus size={20} />
                    Register Device
                </button>
            </div>

            <div style={styles.grid}>
                {devices.map(device => (
                    <div key={device.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.iconContainer}>
                                <Cpu size={24} color="#38bdf8" />
                            </div>
                            <div style={styles.statusContainer}>
                                <Activity size={16} color={device.last_seen ? "#4ade80" : "#94a3b8"} />
                                <span style={{ color: device.last_seen ? "#4ade80" : "#94a3b8", fontSize: '0.8rem' }}>
                                    {device.last_seen ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>

                        <h3 style={styles.deviceName}>{device.name}</h3>
                        <p style={styles.serialNumber}>SN: {device.serial_number}</p>

                        <div style={styles.tokenContainer}>
                            <span style={styles.tokenLabel}>API Token:</span>
                            <div style={styles.tokenBox}>
                                <span style={styles.tokenText}>
                                    {device.token.substring(0, 8)}...
                                </span>
                                <button onClick={() => handleCopyToken(device.token)} style={styles.copyButton} title="Copy Token">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>

                        <div style={styles.telemetryPreview}>
                            <span style={styles.telemetryLabel}>Latest Data:</span>
                            <pre style={styles.jsonPreview}>
                                {JSON.stringify(device.latest_telemetry, null, 2) || 'No data'}
                            </pre>
                        </div>

                        <button onClick={() => handleDelete(device.id)} style={styles.deleteButton}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Register New Device</h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Device Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                    placeholder="e.g. Conveyor Motor A"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Serial Number</label>
                                <input
                                    type="text"
                                    name="serial_number"
                                    value={formData.serial_number}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                    placeholder="Unique Serial ID"
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitButton}>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        color: '#fff',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    addButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: '500',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #334155',
        position: 'relative',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    iconContainer: {
        padding: '0.75rem',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderRadius: '0.5rem',
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
    deviceName: {
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '0.25rem',
    },
    serialNumber: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        marginBottom: '1rem',
    },
    tokenContainer: {
        marginBottom: '1rem',
        padding: '0.75rem',
        backgroundColor: '#0f172a',
        borderRadius: '0.5rem',
    },
    tokenLabel: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        display: 'block',
        marginBottom: '0.25rem',
    },
    tokenBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tokenText: {
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        color: '#cbd5e1',
    },
    copyButton: {
        background: 'none',
        border: 'none',
        color: '#38bdf8',
        cursor: 'pointer',
        padding: '0.25rem',
    },
    telemetryPreview: {
        fontSize: '0.8rem',
    },
    telemetryLabel: {
        color: '#94a3b8',
        marginBottom: '0.25rem',
        display: 'block',
    },
    jsonPreview: {
        backgroundColor: '#0f172a',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        color: '#a5b4fc',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        margin: 0,
    },
    deleteButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'none',
        border: 'none',
        color: '#ef4444',
        cursor: 'pointer',
        padding: '0.25rem',
        opacity: 0.5,
        transition: 'opacity 0.2s',
    },
    loading: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: '2rem',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#1e293b',
        padding: '2rem',
        borderRadius: '0.75rem',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #334155',
    },
    modalTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        color: '#cbd5e1',
    },
    input: {
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: '#fff',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginTop: '1rem',
    },
    cancelButton: {
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: '1px solid #334155',
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        cursor: 'pointer',
    },
    submitButton: {
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        backgroundColor: '#3b82f6',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default DeviceManager;
