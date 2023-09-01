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

const brandService = {
    getAllBrands,
};

export default brandService;