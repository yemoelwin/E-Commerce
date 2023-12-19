import api from "../../app/api/currentApi";

const blogUploadImg = async (formData) => {
	try {
		const response = await api.post(`/upload/blog/images`, formData);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error(
				"An error occurred while uploading blog image to cloudinary.",
			); // Fallback error message
		}
	}
};

const deleteImg = async (id) => {
	try {
		const response = await api.delete(`/upload/delete_images/${id}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error(
				"An error occurred while deleting blog image from cloudinary.",
			); // Fallback error message
		}
	}
};

const blogUploadService = {
	blogUploadImg,
	deleteImg,
};

export default blogUploadService;
