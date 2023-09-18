import api from '../../app/api/currentApi';

const getColors = async () => {
    try {
        const response = await api.get('/color/');
        return response.data;
    } catch (error) {
        console.error("An error occurred whilefetchting all colors:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
};

const createColor = async (data) => {
    try {
        const response = await api.post('/color/create-color/youngsone', data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while creating color:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
};

const getColor = async (id) => {
    try {
        const response = await api.get(`/color/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching single color:", error.message);
        throw new Error(); // Re-throw the error for higher-level handling
    }
};

const updateColor = async (data) => {
    try {
        const response = await api.put(`/color/update/${data.id}`, {color : data.colorData.color});
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching single color:", error.message);
        throw new Error(); // Re-throw the error for higher-level handling
    }
};

const deleteColor = async (id) => {
    try {
        const response = await api.delete(`/color/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleteing color:", error);
        throw new Error(); // Re-throw the error for higher-level handling
    }
}

const colorService = {
    getColors,
    createColor,
    getColor,
    updateColor,
    deleteColor,
};

export default colorService;