import api from './api';

const deviceService = {
    getAllDevices: async () => {
        const response = await api.get('devices/devices/');
        return response.data;
    },

    createDevice: async (deviceData) => {
        const response = await api.post('devices/devices/', deviceData);
        return response.data;
    },

    deleteDevice: async (id) => {
        await api.delete(`devices/devices/${id}/`);
    },

    // Helper to copy token
    copyToken: (token) => {
        navigator.clipboard.writeText(token);
    }
};

export default deviceService;
