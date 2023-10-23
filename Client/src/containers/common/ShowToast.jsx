import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type = 'success') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'info':
            toast.info(message);
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
