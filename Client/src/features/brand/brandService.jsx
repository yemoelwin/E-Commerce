import api from '../../app/api/currentApi';

const getAllBrands = async () => {
    try {
        const response = await api.get('/brand/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const createBrand = async (data) => {
    try {
        const response = await api.post('/brand/create-brand', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const brandService = {
    getAllBrands,
    createBrand
};

export default brandService;