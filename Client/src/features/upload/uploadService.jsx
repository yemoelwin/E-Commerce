import api from '../../app/api/currentApi';

const uploadImg = async (formData) => {
    try {
        const response = await api.post(`/upload/images`, formData);
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

const uploadService = {
    uploadImg,
    deleteImg,
};

export default uploadService;