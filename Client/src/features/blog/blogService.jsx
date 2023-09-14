import api from '../../app/api/currentApi';

const getBlogs = async () => {
    try {
        const response = await api.get('/blog/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during fetching blog data:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const createNewBlog = async (data) => {
    console.log('apiblogdata',data);
    try {
        const response = await api.post('/blog/create-blog', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred during creating blog data:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
}

const blogService = {
    getBlogs,
    createNewBlog,
};

export default blogService;