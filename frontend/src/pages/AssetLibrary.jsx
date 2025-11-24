import React, { useState, useEffect } from 'react';
import libraryService from '../services/libraryService';
import { Plus, Trash2, Box } from 'lucide-react';

const AssetLibrary = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'MACHINE',
        default_scale: 1.0,
        file: null,
        thumbnail: null
    });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const data = await libraryService.getAllAssets();
            setAssets(data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('default_scale', formData.default_scale);
        if (formData.file) data.append('file', formData.file);
        if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

        try {
            await libraryService.createAsset(data);
            setShowModal(false);
            fetchAssets();
            setFormData({ name: '', category: 'MACHINE', default_scale: 1.0, file: null, thumbnail: null });
        } catch (error) {
            console.error('Error creating asset:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await libraryService.deleteAsset(id);
                fetchAssets();
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    if (loading) return <div style={styles.loading}>Loading Library...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>3D Asset Library</h2>
                <button onClick={() => setShowModal(true)} style={styles.addButton}>
                    <Plus size={20} />
                    Upload Asset
                </button>
            </div>

            <div style={styles.grid}>
                {assets.map(asset => (
                    <div key={asset.id} style={styles.card}>
                        <div style={styles.thumbnailContainer}>
                            {asset.thumbnail ? (
                                <img src={asset.thumbnail} alt={asset.name} style={styles.thumbnail} />
                            ) : (
                                <div style={styles.placeholderThumbnail}>
                                    <Box size={48} color="#475569" />
                                </div>
                            )}
                        </div>
                        <div style={styles.cardContent}>
                            <h3 style={styles.cardTitle}>{asset.name}</h3>
                            <p style={styles.cardCategory}>{asset.category}</p>
                            <button onClick={() => handleDelete(asset.id)} style={styles.deleteButton}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Upload New Asset</h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    style={styles.select}
                                >
                                    <option value="MACHINE">Machine</option>
                                    <option value="SENSOR">Sensor</option>
                                    <option value="INFRASTRUCTURE">Infrastructure</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>3D Model (.glb/.gltf)</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".glb,.gltf"
                                    onChange={handleFileChange}
                                    required
                                    style={styles.fileInput}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Thumbnail (Optional)</label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitButton}>
                                    Upload
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #334155',
        transition: 'transform 0.2s',
    },
    thumbnailContainer: {
        height: '140px',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholderThumbnail: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    cardContent: {
        padding: '1rem',
        position: 'relative',
    },
    cardTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.25rem',
    },
    cardCategory: {
        fontSize: '0.8rem',
        color: '#94a3b8',
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
        maxWidth: '500px',
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
    select: {
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: '#fff',
    },
    fileInput: {
        color: '#94a3b8',
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

export default AssetLibrary;
