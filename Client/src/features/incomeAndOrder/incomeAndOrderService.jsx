import api from "../../app/api/currentApi";

const getYearlyIncomesAndOrders = async () => {
	try {
		const response = await api.get(`/ordersAndincomes/getYearlyOrderIncome`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while registering."); // Fallback error message
		}
	}
};

const getMonthlyIncomesAndOrders = async (selectedYear) => {
	try {
		const response = await api.get(
			`/ordersAndincomes/getMonthlyOrderIncome/${selectedYear}`,
		);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while registering."); // Fallback error message
		}
	}
};

const incomeAndOrderService = {
	getYearlyIncomesAndOrders,
	getMonthlyIncomesAndOrders,
};

export default incomeAndOrderService;
