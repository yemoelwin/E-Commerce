import api from "../../app/api/currentApi";

const getProducts = async () => {
    try {
        const response = await api.get('/product/');
        return response.data;
    } catch (error) {
        console.error("An error occurred during fetching all products:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

const createProduct = async (prod) => {
    try {
        const response = await api.post('/product/create-product', prod);
        return response.data;
    } catch (error) {
        console.error("An error occurred while creating product:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const addToWishlist = async (prodId) => {
    try {
        const response = await api.put(`/product/wishlist`, {prodId});
        return response.data;
    } catch (error) {
        console.error("An error occurred while adding product to wishlist:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const removeFromToWishlist = async (prodId) => {
    try {
        const response = await api.put(`/product/remove_wishlist`, {prodId});
        return response.data;
    } catch (error) {
        console.error("An error occurred while adding product to wishlist:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const getProduct = async (prodId) => {
    console.log('serviceProdId', prodId)
    try {
        const response = await api.get(`/product/retrieve/${prodId}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching single product:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const updateProduct = async (data) => {
    try {
        const response = await api.put(`/product/update/${data.id}`,  {title: data.prodData.title, description: data.prodData.description, category: data.prodData.category, brand: data.prodData.brand, color: data.prodData.color, images: data.prodData.images, tags: data.prodData.tags, price: data.prodData.price, quantity: data.prodData.quantity});
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching single product:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/product/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleting product:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

const productService = {
    getProducts,
    createProduct,
    addToWishlist,
    removeFromToWishlist,
    getProduct,
    updateProduct,
    deleteProduct,
};

export default productService;