import { toast } from 'react-toastify';

export const showToast = (message, type = 'success') => {
    switch (type) {
        case 'success':
            toast.success(message);
        break;
        case 'error':
            toast.error(message);
        break;
        // Add more types as needed
        default:
            toast(message);
        break;
    }
};
