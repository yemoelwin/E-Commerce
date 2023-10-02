import api from '../../app/api/currentApi';

const getAllCoupons = async () => {
    try {
        const response = await api.get('/coupon/');
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching all coupon data:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const createCoupon = async (data) => {
    try {
        const response = await api.post('/coupon/createCoupon', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while creating coupon:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const deleteCoupon = async (id) => {
    try {
        const response = await api.delete(`/coupon/${id}` );
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleting coupon:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const couponService = {
    getAllCoupons,
    createCoupon,
    deleteCoupon,
};

export default couponService;