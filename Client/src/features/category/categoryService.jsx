import api from '../../app/api/currentApi';

const getAllCategory = async () => {
    try {
        const response = await api.get('/category/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const categoryService = {
    getAllCategory,
};

export default categoryService;