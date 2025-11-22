import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Note: Django DRF usually expects 'Token <token>' or 'Bearer <token>' depending on auth setup.
            // Default TokenAuthentication uses 'Token'. JWT uses 'Bearer'.
            // We haven't set up JWT yet, using Basic/Session for now or we need to add TokenAuth.
            // Let's assume we will use TokenAuth or JWT. For now, let's stick to a placeholder.
            // I'll use 'Bearer' as it's standard, but I need to ensure backend supports it.
            // Actually, for the initial setup, I'll just leave it prepared.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
