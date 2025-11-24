import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Factory, Settings, LogOut, Box, Users, Cpu } from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/digital-twin', icon: <Box size={20} />, label: 'Digital Twin' },
        { path: '/plants', icon: <Factory size={20} />, label: 'Plants' },
        { path: '/clients', icon: <Users size={20} />, label: 'Clients' },
        { path: '/assets', icon: <Box size={20} />, label: 'Assets' },
        { path: '/library', icon: <Box size={20} />, label: '3D Library' },
        { path: '/devices', icon: <Cpu size={20} />, label: 'Devices' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div style={styles.logoContainer}>
                    <h1 style={styles.logo}>SmartFactory</h1>
                </div>
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                ...styles.navItem,
                                ...(location.pathname === item.path ? styles.activeNavItem : {}),
                            }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div style={styles.userProfile}>
                    <div style={styles.userInfo}>
                        <p style={styles.userName}>{user?.username}</p>
                        <p style={styles.userRole}>{user?.role || 'Operator'}</p>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <h2 style={styles.pageTitle}>
                        {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>
                <div style={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#fff',
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
    },
    logoContainer: {
        padding: '1.5rem',
        borderBottom: '1px solid #334155',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#38bdf8',
        margin: 0,
    },
    nav: {
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        color: '#94a3b8',
        textDecoration: 'none',
        transition: 'all 0.2s',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    activeNavItem: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        color: '#38bdf8',
    },
    userProfile: {
        padding: '1rem',
        borderTop: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e293b',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: '0.9rem',
        fontWeight: '600',
        margin: 0,
    },
    userRole: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        margin: 0,
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'color 0.2s',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        height: '64px',
        backgroundColor: '#1e293b', // Match sidebar for seamless look or keep distinct
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
    },
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: 0,
    },
    content: {
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
    },
};

export default AdminLayout;
