import api from "../../app/api/currentApi";

const createInquiry = async (data) => {
	console.log("data", data);
	try {
		const response = await api.post("/inquiry/create-inquiry", data);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while creating inquries."); // Fallback error message
		}
	}
};

const getEnquiries = async () => {
	try {
		const response = await api.get("/inquiry/");
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while fetching all inquiries."); // Fallback error message
		}
	}
};

const getInquiry = async (id) => {
	try {
		const response = await api.get(`/inquiry/${id}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while getching single inquiry."); // Fallback error message
		}
	}
};

const updateInquiry = async (data) => {
	try {
		const response = await api.put(`/inquiry/update/${data.id}`, {
			status: data.inquiryData,
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while updating inquiries status."); // Fallback error message
		}
	}
};

const deleteInquiry = async (id) => {
	try {
		const response = await api.delete(`/inquiry/delete/${id}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while deleting user inquiries."); // Fallback error message
		}
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
