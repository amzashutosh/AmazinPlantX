import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <h3>Total Plants</h3>
                    <p style={styles.stat}>3</p>
                </div>
                <div style={styles.card}>
                    <h3>Active Sensors</h3>
                    <p style={styles.stat}>124</p>
                </div>
                <div style={styles.card}>
                    <h3>Critical Alerts</h3>
                    <p style={{ ...styles.stat, color: '#ef4444' }}>2</p>
                </div>
                <div style={styles.card}>
                    <h3>System Status</h3>
                    <p style={{ ...styles.stat, color: '#22c55e' }}>Healthy</p>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3>Recent Activity</h3>
                <div style={styles.activityCard}>
                    <p>Plant A - Pump 3 vibration warning - 10 mins ago</p>
                </div>
                <div style={styles.activityCard}>
                    <p>Plant B - Conveyor Belt stopped - 1 hour ago</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#1e293b',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #334155',
    },
    stat: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0.5rem 0 0 0',
        color: '#38bdf8',
    },
    activityCard: {
        backgroundColor: '#1e293b',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #334155',
        marginTop: '1rem',
        color: '#cbd5e1',
    }
};

export default Dashboard;
