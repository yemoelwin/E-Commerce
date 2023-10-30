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

const forgotPasswordToken = async (data) => {
    console.log('servicePasswordData', data)
    try {
        const response = await api.post(`/user/forgot-password`, {email: data.email});
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

const resetPassword = async (data) => {
    console.log('resetPassword', data)
    try {
        const response = await api.post(`/user/reset-password/${data.userId}/${data.uniqueToken}`, {password: data.password});
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



// const logout = async () => {
//     try {
//         const response = await api.post(`/user/auth/user-logout`);
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.data && error.response.data.message) {
//             throw new Error(error.response.data.message);
//         } else {
//             console.error("error", error);
//             throw new Error('An error occurred while signing in.'); // Fallback error message
//         }
//     }
    
// };



const authService = {
    register,
    login,
    forgotPasswordToken,
    resetPassword,
    // logout,
};

export default authService;

