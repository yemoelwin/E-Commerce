import api from '../../app/api/currentApi';

const getUsers = async () => {
    const response = await api.get(`/user/alluser`);
    // console.log('request data', response.data);
    return response.data;
};

const customerService = {
    getUsers,
};

export default customerService;