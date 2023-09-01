import api from '../../app/api/currentApi';

const getBlogCategory = async () => {
    try {
        const response = await api.get('/blogCategory/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const blogCategoryService = {
    getBlogCategory,
};

export default blogCategoryService;