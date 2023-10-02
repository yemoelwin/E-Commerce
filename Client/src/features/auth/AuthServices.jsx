import api from '../../app/api/currentApi';

const register = async (data) => {
    try {
        const response = await api.post(`/user/register`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
      // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while registering.'); // Fallback error message
        }
    }
};

const login = async (user) => {
    try {
        const response = await api.post(`/user/login`, user);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while signing in.'); // Fallback error message
        }
    }
    
};

const getOrders = async () => {
    try {
        const response = await api.get('/user/order/allorders')
        return response.data;
    } catch (error) {
        console.error(error.response.data); // Re-throw the error for higher-level handlings
        throw new Error();
    }   
};

const getOrder = async (id) => {
    try {
        const response = await api.get(`/user/order/get_order_byuser/${id}`)
        return response.data;
    } catch (error) {
        console.error("An error occurred while updating order status", error);
        throw error; // Re-throw the error for higher-level handling
    }   
};

const updateOrderStatus = async (data) => {
    try {
        const response = await api.put(`/user/order/update_user_order_status/${data.id}`, {orderStatus: data.data})
        return response.data;
    } catch (error) {
        console.error("An error occurred while updating order status", error);
        throw error; // Re-throw the error for higher-level handling
    }   
};


const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/user/delete_order/${id}`)
        return response.data;
    } catch (error) {
        console.error("An error occurred while updating order status", error);
        throw error; // Re-throw the error for higher-level handling
    }   
};

const authService = {
    register,
    login,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder,
};

export default authService;

