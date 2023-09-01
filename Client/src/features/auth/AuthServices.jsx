import api from '../../app/api/currentApi';

const login = async (user) => {
    const response = await api.post(`/user/login`, user);
    return response.data;
};

const getOrders = async () => {
    try {
        const response = await api.get('/user/order/allorders')
        console.log('responseData',response);
        return response.data;
    } catch (error) {
        // console.error("An error occurred during login:", error);
        console.error(error.response.data); // Re-throw the error for higher-level handlings
    }   
};

const authService = {
    login,
    getOrders
};

export default authService;

// const login = async (user) => {
//     try {
//         const response = await axios.post(`${base_url}/user/login`,
//         JSON.stringify(user),
//         {
//             headers: {'Content-Type': 'application/json'},
//             withCredentials: true,
//         }
//         );
//         console.log("response data", response);
//         return response.data.user;
//     } catch (error) {
//         console.error("An error occurred during login:", error);
//         throw error; // Re-throw the error for higher-level handling
//     }
// };

