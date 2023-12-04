import api from "../../app/api/currentApi";

const getAllBrands = async () => {
	try {
		const response = await api.get("/brand/");
		return response.data;
	} catch (error) {
		console.error(
			"An error occurred while fetching all the brand data:",
			error,
		);
		throw error; // Re-throw the error for higher-level handling
	}
};

const addBrand = async (data) => {
	try {
		const response = await api.post("/brand/post/add-brand", data);
		return response.data;
	} catch (error) {
		console.error("An error occurred while creating new brand:", error);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const getBrand = async (id) => {
	try {
		const response = await api.get(`/brand/single/${id}`);
		return response.data;
	} catch (error) {
		console.error(
			"An error occurred while fetching single brand with id:",
			error.message,
		);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const updateBrand = async (brandData) => {
	try {
		const response = await api.put(`/brand/updBrand/${brandData.id}`, {
			title: brandData.data.title,
		});
		return response.data;
	} catch (error) {
		console.error("An error occurred while updating new brand:", error);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const deleteBrand = async (_id) => {
	try {
		const response = await api.delete(`/brand/delete/${_id}`);
		return response.data;
	} catch (error) {
		console.error("An error occurred while deleting new brand:", error);
		throw new Error(); // Re-throw the error for higher-level handling
	}
};

const brandService = {
	getAllBrands,
	addBrand,
	getBrand,
	updateBrand,
	deleteBrand,
};

export default brandService;
