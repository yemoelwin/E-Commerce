import api from '../../app/api/currentApi';

const getUserWishlist = async () => {
    try {
        const response = await api.get('/user/wish/user_wishlist');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while fetching user wishlist.'); // Fallback error message
        }
    }
};

const saveOrder = async (data) => {
    console.log('service data', data)
    try {
        const response = await api.post('/user/order/create_userOrder', {cartData: data.cartData, cartTotalAmount: data.cartTotalAmount, totalQuantity: data.totalQuantity, transitionId: data.transitionId});
        console.log('reponsedata', response.data)
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while fetching user wishlist.'); // Fallback error message
        }
    }
};

const getOrder = async ({userId, transitionId}) => {
    // console.log('service data', data)
    try {
        const response = await api.get(`/user/order/get_order/${userId}/${transitionId}`);
        // console.log('reponsedata', response.data)
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while fetching user wishlist.'); // Fallback error message
        }
    }
};

const getOrders = async (id) => {
    console.log('service id', id)
    try {
        const response = await api.get(`/user/order/user-orders/${id}`)
        return response.data;
    } catch (error) {
        console.error(error.response.data); // Re-throw the error for higher-level handlings
        throw new Error();
    }   
};

const getallUserOrders = async () => {
    try {
        const response = await api.get(`/user/order/all-orders`)
        return response.data;
    } catch (error) {
        console.error(error.response.data); // Re-throw the error for higher-level handlings
        throw new Error();
    }   
};

// const getOrder = async (id) => {
//     try {
//         const response = await api.get(`/user/order/get_order_byuser/${id}`)
//         return response.data;
//     } catch (error) {
//         console.error("An error occurred while updating order status", error);
//         throw error; // Re-throw the error for higher-level handling
//     }   
// };

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

const invoicePDF = async (id) => {
    console.log('service id',id)
    try {
        const response = await api.get(`/invoice/pdf-invoice/${id}`);
        console.log('reponsedata', response.data)
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while fetching user wishlist.'); // Fallback error message
        }
    }
};


const userService = {
    getUserWishlist,
    saveOrder,
    getOrder,
    getOrders,
    getallUserOrders,
    invoicePDF,
};

export default userService;