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

const login = async (data) => {
    console.log('serviceLogindata', data);
    try {
        const response = await api.post(`/user/auth/login`, {email: data.email, password: data.password});
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

const logout = async (data) => {
    console.log('serviceLogoutdata', data);
    try {
        const response = await api.post(`/user/auth/logout`);
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



const authService = {
    register,
    login,
};

export default authService;

