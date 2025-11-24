import api from './api';

const sceneService = {
    saveScene: async (plantId, sceneObjects) => {
        const payload = {
            plant_id: plantId,
            assets: sceneObjects
        };
        const response = await api.post('assets/save_scene/', payload);
        return response.data;
    },

    getPlantAssets: async (plantId) => {
        const response = await api.get(`assets/?plant=${plantId}`);
        return response.data;
    }
};

export default sceneService;
