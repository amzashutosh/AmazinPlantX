import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (e.g. check token in localStorage)
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token or load user profile
            // For now, we'll just simulate a user if token exists
            setUser({ username: 'admin' }); // Replace with actual API call
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // In a real app, we would call the API
        // const response = await api.post('core/login/', { username, password });
        // localStorage.setItem('token', response.data.token);
        // setUser(response.data.user);

        // Mock login for now
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('token', 'mock-token');
            setUser({ username: 'admin', role: 'SUPER_ADMIN' });
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
