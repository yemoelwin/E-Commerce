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
    try {
        const response = await api.post('/blog/create-blog', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred during creating blog data:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
}

const updateBlogData = async (data) => {
    try {
        const response = await api.put(`/blog/updateBlog/${data.id}`, { title: data.updatedBlog.title, category: data.updatedBlog.category, description: data.updatedBlog.description, images: data.updatedBlog.images});
        return response.data;
    } catch (error) {
        console.error("An error occurred while updating blog", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const getBlog = async (id) => {
    try {
        const response = await api.get(`/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred during fetching single blog data:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
}

const deleteBlog = async (id) => {
    try {
        const response = await api.delete(`/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred during deleting single blog data:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
}

const blogService = {
    getBlogs,
    createNewBlog,
    updateBlogData,
    getBlog,
    deleteBlog,
};

export default blogService;