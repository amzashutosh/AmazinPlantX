import api from './api';

const libraryService = {
    getAllAssets: async () => {
        const response = await api.get('library/assets/');
        return response.data;
    },

    createAsset: async (formData) => {
        const response = await api.post('library/assets/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteAsset: async (id) => {
        await api.delete(`library/assets/${id}/`);
    },
};

export default libraryService;
