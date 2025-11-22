import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Box, Factory } from 'lucide-react';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        plant: '',
        asset_type: 'machine',
    });

    useEffect(() => {
        fetchAssets();
        fetchPlants();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await api.get('assets/assets/');
            setAssets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setLoading(false);
        }
    };

    const fetchPlants = async () => {
        try {
            const response = await api.get('tenants/plants/');
            setPlants(response.data);
        } catch (error) {
            console.error('Error fetching plants:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAsset) {
                await api.put(`assets/assets/${editingAsset.id}/`, formData);
            } else {
                await api.post('assets/assets/', formData);
            }
            fetchAssets();
            closeModal();
        } catch (error) {
            console.error('Error saving asset:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await api.delete(`assets/assets/${id}/`);
                fetchAssets();
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    const openModal = (asset = null) => {
        if (asset) {
            setEditingAsset(asset);
            setFormData({
                name: asset.name,
                plant: asset.plant,
                asset_type: asset.asset_type,
            });
        } else {
            setEditingAsset(null);
            setFormData({ name: '', plant: '', asset_type: 'machine' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAsset(null);
        setFormData({ name: '', plant: '', asset_type: 'machine' });
    };

    if (loading) {
        return <div style={styles.loading}>Loading assets...</div>;
    }

    return (
        <div>
            <div style={styles.header}>
                <h2 style={styles.title}>Asset Management</h2>
                <button onClick={() => openModal()} style={styles.addButton}>
                    <Plus size={18} />
                    <span>Add Asset</span>
                </button>
            </div>

            <div style={styles.grid}>
                {assets.map((asset) => (
                    <div key={asset.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.iconContainer}>
                                <Box size={24} color="#38bdf8" />
                            </div>
                            <div style={styles.actions}>
                                <button onClick={() => openModal(asset)} style={styles.iconButton}>
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(asset.id)} style={styles.iconButton}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 style={styles.cardTitle}>{asset.name}</h3>
                        <div style={styles.cardInfo}>
                            <Factory size={14} />
                            <span>{plants.find((p) => p.id === asset.plant)?.name || 'Unknown Plant'}</span>
                        </div>
                        <div style={styles.cardFooter}>
                            <span style={styles.badge}>
                                Type: {asset.asset_type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {assets.length === 0 && (
                <div style={styles.empty}>
                    <Box size={48} color="#475569" />
                    <p>No assets found. Add your first asset to get started.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>
                            {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                        </h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Asset Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Plant *</label>
                                <select
                                    value={formData.plant}
                                    onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
                                    style={styles.input}
                                    required
                                >
                                    <option value="">Select Plant</option>
                                    {plants.map((plant) => (
                                        <option key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Asset Type</label>
                                <select
                                    value={formData.asset_type}
                                    onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                                    style={styles.input}
                                >
                                    <option value="machine">Machine</option>
                                    <option value="sensor">Sensor</option>
                                    <option value="gateway">Gateway</option>
                                </select>
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitButton}>
                                    {editingAsset ? 'Update' : 'Create'}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '600',
        margin: 0,
    },
    addButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#1e293b',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #334155',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    iconContainer: {
        width: '48px',
        height: '48px',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'color 0.2s, background-color 0.2s',
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 0.5rem 0',
        color: '#fff',
    },
    cardInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#94a3b8',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    },
    cardFooter: {
        paddingTop: '1rem',
        borderTop: '1px solid #334155',
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        color: '#38bdf8',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    empty: {
        textAlign: 'center',
        padding: '4rem 2rem',
        color: '#94a3b8',
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
        color: '#94a3b8',
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
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        border: '1px solid #334155',
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#fff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#cbd5e1',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #475569',
        backgroundColor: '#0f172a',
        color: '#fff',
        outline: 'none',
        fontSize: '0.95rem',
    },
    modalActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    cancelButton: {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #475569',
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        cursor: 'pointer',
        fontWeight: '500',
    },
    submitButton: {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        cursor: 'pointer',
        fontWeight: '600',
    },
};

export default Assets;
