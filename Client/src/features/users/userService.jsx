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
    // console.log('service data', data)
    try {
        const response = await api.post('/user/order/create_userOrder', data);
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
    invoicePDF,
};

export default userService;