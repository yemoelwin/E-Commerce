import api from '../../app/api/currentApi';

const getEnquiries = async (token) => {
    try {
        const response = await api.get('/inquiry/')
        return response.data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error; // Re-throw the error for higher-level handlings
    }
    
};

const inquiryService = {
    getEnquiries,
};

export default inquiryService;




// const response = await api.get('/inquiry/', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//     })