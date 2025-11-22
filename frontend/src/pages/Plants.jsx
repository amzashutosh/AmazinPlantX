import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, MapPin, Factory } from 'lucide-react';

const Plants = () => {
    const [plants, setPlants] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        client: '',
        model_url: '',
    });

    useEffect(() => {
        fetchPlants();
        fetchClients();
    }, []);

    const fetchPlants = async () => {
        try {
            const response = await api.get('tenants/plants/');
            setPlants(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plants:', error);
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get('tenants/clients/');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPlant) {
                await api.put(`tenants/plants/${editingPlant.id}/`, formData);
            } else {
                await api.post('tenants/plants/', formData);
            }
            fetchPlants();
            closeModal();
        } catch (error) {
            console.error('Error saving plant:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plant?')) {
            try {
                await api.delete(`tenants/plants/${id}/`);
                fetchPlants();
            } catch (error) {
                console.error('Error deleting plant:', error);
            }
        }
    };

    const openModal = (plant = null) => {
        if (plant) {
            setEditingPlant(plant);
            setFormData({
                name: plant.name,
                location: plant.location,
                client: plant.client,
                model_url: plant.model_url || '',
            });
        } else {
            setEditingPlant(null);
            setFormData({ name: '', location: '', client: '', model_url: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlant(null);
        setFormData({ name: '', location: '', client: '', model_url: '' });
    };

    if (loading) {
        return <div style={styles.loading}>Loading plants...</div>;
    }

    return (
        <div>
            <div style={styles.header}>
                <h2 style={styles.title}>Plant Management</h2>
                <button onClick={() => openModal()} style={styles.addButton}>
                    <Plus size={18} />
                    <span>Add Plant</span>
                </button>
            </div>

            <div style={styles.grid}>
                {plants.map((plant) => (
                    <div key={plant.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.iconContainer}>
                                <Factory size={24} color="#38bdf8" />
                            </div>
                            <div style={styles.actions}>
                                <button onClick={() => openModal(plant)} style={styles.iconButton}>
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(plant.id)} style={styles.iconButton}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 style={styles.cardTitle}>{plant.name}</h3>
                        <div style={styles.cardInfo}>
                            <MapPin size={14} />
                            <span>{plant.location || 'No location'}</span>
                        </div>
                        <div style={styles.cardFooter}>
                            <span style={styles.badge}>
                                {clients.find((c) => c.id === plant.client)?.name || 'Unknown Client'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {plants.length === 0 && (
                <div style={styles.empty}>
                    <Factory size={48} color="#475569" />
                    <p>No plants found. Add your first plant to get started.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>
                            {editingPlant ? 'Edit Plant' : 'Add New Plant'}
                        </h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Plant Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Client *</label>
                                <select
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    style={styles.input}
                                    required
                                >
                                    <option value="">Select Client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>3D Model URL</label>
                                <input
                                    type="url"
                                    value={formData.model_url}
                                    onChange={(e) => setFormData({ ...formData, model_url: e.target.value })}
                                    style={styles.input}
                                    placeholder="https://example.com/model.glb"
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitButton}>
                                    {editingPlant ? 'Update' : 'Create'}
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

export default Plants;
