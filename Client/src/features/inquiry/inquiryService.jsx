import api from "../../app/api/currentApi";

const createInquiry = async (data) => {
	try {
		const response = await api.post("/inquiry/create-inquiry", data);
		return response.data;
	} catch (error) {
		console.error("An error occurred while creating inquiry inform :", error);
		throw new Error(); // Re-throw the error for higher-level handlings
	}
};

const getEnquiries = async () => {
	try {
		const response = await api.get("/inquiry/");
		return response.data;
	} catch (error) {
		console.error("An error occurred while fetching all inquiry data :", error);
		throw new Error(); // Re-throw the error for higher-level handlings
	}
};

const getInquiry = async (id) => {
	try {
		const response = await api.get(`/inquiry/${id}`);
		return response.data;
	} catch (error) {
		console.error(
			"An error occurred while fetching single inquiry data :",
			error,
		);
		throw new Error(); // Re-throw the error for higher-level handlings
	}
};

const updateInquiry = async (data) => {
	try {
		const response = await api.put(`/inquiry/update/${data.id}`, {
			status: data.inquiryData,
		});
		return response.data;
	} catch (error) {
		console.error("An error occurred while updating inquiry status :", error);
		throw new Error(); // Re-throw the error for higher-level handlings
	}
};

const deleteInquiry = async (id) => {
	try {
		const response = await api.delete(`/inquiry/delete/${id}`);
		return response.data;
	} catch (error) {
		console.error("An error occurred while deleting inquiry data :", error);
		throw new Error(); // Re-throw the error for higher-level handlings
	}
};

const inquiryService = {
	createInquiry,
	getEnquiries,
	getInquiry,
	updateInquiry,
	deleteInquiry,
};

export default inquiryService;

// const response = await api.get('/inquiry/', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//     })
