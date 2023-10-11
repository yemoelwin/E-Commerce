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







// const updateQuantity = async (cartDetail) => {
//     console.log("cartDetail",cartDetail);
//     // console.log("quantity",quantity);
//     try {
//         const response = await api.put(`/user/cart/update-cart-items-quantity`, { cartItemId : cartDetail.id, quantity : cartDetail.quantity});
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.data && error.response.data.message) {
//             // Extract and return the error message from the backend
//             throw new Error(error.response.data.message);
//         } else {
//             console.error("error", error);
//             throw new Error('An error occurred while updating items quantity.'); // Fallback error message
//         }
//     }
// }

const userService = {
    getUserWishlist,
    // addToCart,
    // getUserCart,
    // updateQuantity,
    // removeItemFromCart,
};

export default userService;