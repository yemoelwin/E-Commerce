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

const createBlogCategory = async (data) => {
    try {
        const response = await api.post('/blogCategory/create-blogcategory', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while creating blog category", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const blogCategoryService = {
    getBlogCategory,
    createBlogCategory
};

export default blogCategoryService;