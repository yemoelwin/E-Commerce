import api from "../../app/api/currentApi";

const allBlogCategory = async () => {
	try {
		const response = await api.get("/blogCategory/");
		return response.data;
	} catch (error) {
		console.error(
			"An error occurred while fetching all blogCategories:",
			error,
		);
		throw error; // Re-throw the error for higher-level handling
	}
};

const createBlogCategory = async (data) => {
	try {
		const response = await api.post("/blogCategory/create-blogcategory", data);
		return response.data;
	} catch (error) {
		console.error("An error occurred while creating blog category", error);
		throw error; // Re-throw the error for higher-level handling
	}
};

const updateBlogCategory = async (data) => {
	try {
		const response = await api.put(`/blogCategory/update/${data.id}`, {
			title: data.blgCatgoryData.title,
		});
		return response.data;
	} catch (error) {
		console.error("An error occurred while updating blog category", error);
		throw error; // Re-throw the error for higher-level handling
	}
};

const BlogCategory = async (id) => {
	try {
		const response = await api.get(`/blogCategory/${id}`);
		return response.data;
	} catch (error) {
		console.error(
			"An error occurred while fetching single blog category",
			error,
		);
		throw error; // Re-throw the error for higher-level handling
	}
};

const deleteBlogCategory = async (id) => {
	try {
		const response = await api.delete(`/blogCategory/delete/${id}`);
		return response.data;
	} catch (error) {
		console.error("An error occurred while deleting blog category", error);
		throw error; // Re-throw the error for higher-level handling
	}
};

const blogCategoryService = {
	allBlogCategory,
	createBlogCategory,
	updateBlogCategory,
	BlogCategory,
	deleteBlogCategory,
};

export default blogCategoryService;
