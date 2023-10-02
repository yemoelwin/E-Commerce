import api from '../../app/api/currentApi';

const blogUploadImg = async (formData) => {
    try {
        const response = await api.post(`/upload/blog/images`, formData);
        return response.data;
    } catch (error) {
        console.error("An error occurred during uploading image to cloudinary:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const deleteImg = async (id) => {
    try {
        const response = await api.delete(`/upload/delete_images/${ id }`);
        return response.data;
    } catch (error) {
        console.error("An error occurred during deleting images:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const blogUploadService = {
    blogUploadImg,
    deleteImg,
};

export default blogUploadService;