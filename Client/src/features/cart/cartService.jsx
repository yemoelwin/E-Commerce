import api from '../../app/api/currentApi';

const addToCart = async (data) => {
    try {
        const response = await api.post('/user/addtocart', data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while adding to user cart.'); // Fallback error message
        }
    }
};

const getUserCart = async() => {
    try {
        const response = await api.get(`/user/cart/get-usercart`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while fetching user cart.'); // Fallback error message
        }
    }
};

const removeItemFromCart = async (cartItemId) => {
    try {
        const response = await api.delete(`/user/cart/remove-cart-products`, { data: { cartItemId: cartItemId } });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Extract and return the error message from the backend
            throw new Error(error.response.data.message);
        } else {
            console.error("error", error);
            throw new Error('An error occurred while deleting user cart.'); // Fallback error message
        }
    }
};

const cartService = {
    addToCart,
    getUserCart,
    removeItemFromCart,
};

export default cartService;