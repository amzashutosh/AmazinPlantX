import React, { useEffect, useState } from 'react';
import libraryService from '../../services/libraryService';
import { Box } from 'lucide-react';

const AssetSidebar = () => {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const data = await libraryService.getAllAssets();
                setAssets(data);
            } catch (error) {
                console.error('Failed to load assets', error);
            }
        };
        fetchAssets();
    }, []);

    const handleDragStart = (e, asset) => {
        e.dataTransfer.setData('application/json', JSON.stringify(asset));
    };

    return (
        <div style={styles.sidebar}>
            <h3 style={styles.title}>Assets</h3>
            <div style={styles.grid}>
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, asset)}
                        style={styles.card}
                    >
                        <div style={styles.icon}>
                            {asset.thumbnail ? (
                                <img src={asset.thumbnail} alt={asset.name} style={styles.img} />
                            ) : (
                                <Box size={24} />
                            )}
                        </div>
                        <span style={styles.name}>{asset.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        padding: '1rem',
        overflowY: 'auto',
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#fff',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#0f172a',
        borderRadius: '0.5rem',
        cursor: 'grab',
        border: '1px solid #334155',
    },
    icon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#334155',
        borderRadius: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    name: {
        color: '#cbd5e1',
        fontSize: '0.9rem',
    },
};

export default AssetSidebar;
