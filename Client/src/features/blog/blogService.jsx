import api from '../../app/api/currentApi';

const getBlogs = async () => {
    try {
        const response = await api.get('/blog/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const blogService = {
    getBlogs,
};

export default blogService;