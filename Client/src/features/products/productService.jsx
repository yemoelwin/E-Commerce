import api from '../../app/api/currentApi';

const getProducts = async () => {
    try {
        const response = await api.get('/product/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const createProduct = async (prod) => {
    try {
        const response = await api.post('/product/create-product', prod);
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const productService = {
    getProducts,
    createProduct
};

export default productService;