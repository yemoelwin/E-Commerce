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

const createBlog = async (data) => {
    try {
        const response = await api.post('/createBlog', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const blogService = {
    getBlogs,
    createBlog
};

export default blogService;