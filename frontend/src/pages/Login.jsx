import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Smart Factory</h2>
                <p style={styles.subtitle}>Sign in to your account</p>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f172a', // Dark slate
        color: '#fff',
    },
    card: {
        backgroundColor: '#1e293b',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #334155',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '0.5rem',
        color: '#38bdf8', // Sky blue
    },
    subtitle: {
        textAlign: 'center',
        color: '#94a3b8',
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
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
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '0.75rem',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '1rem',
    },
    error: {
        color: '#ef4444',
        fontSize: '0.875rem',
        textAlign: 'center',
    },
};

export default Login;
