import api from "../../app/api/currentApi";

const getAllCategory = async () => {
	try {
		const response = await api.get("/category/");
		return response.data;
	} catch (error) {
		console.error("An error occurred during login:", error);
		throw error; // Re-throw the error for higher-level handling
	}
};

const createCategory = async (data) => {
	try {
		const response = await api.post("/category/create-category", data);
		return response.data;
	} catch (error) {
		console.error("An error occurred while creating category:", error.message);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const updateCategory = async (updatedData) => {
	try {
		const response = await api.put(`/category/update/${updatedData.id}`, {
			title: updatedData.CategoryData.title,
		});
		return response.data;
	} catch (error) {
		console.error("An error occurred while creating category:", error.message);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const getCategory = async (id) => {
	try {
		const response = await api.get(`/category/${id}`);
		return response.data;
	} catch (error) {
		console.error(
			"An error occurred while fetching single category with id:",
			error.message,
		);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const deleteCategory = async (id) => {
	try {
		const response = await api.delete(`/category/${id}`);
		return response.data;
	} catch (error) {
		console.error("An error occurred while deleting new category:", error);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};
const categoryService = {
	getAllCategory,
	createCategory,
	updateCategory,
	getCategory,
	deleteCategory,
};

export default categoryService;
