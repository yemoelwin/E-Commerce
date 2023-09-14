import api from '../../app/api/currentApi';

const getColors = async () => {
    try {
        const response = await api.get('/color/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const createColor = async (data) => {
    try {
        const response = await api.post('/color/create-color/youngsone', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const colorService = {
    getColors,
    createColor
};

export default colorService;