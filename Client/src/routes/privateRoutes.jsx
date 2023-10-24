import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const PrivateRoutes = ({ children }) => {
    const getTokenFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    // if (getTokenFromLocalStorage?.token !== undefined) {
    //     return children;
    // } else {
    //     // navigate('/login', { replace: true });
    //     // <Navigate to={`/login`} replace={true} />;
    //     toast.error('Please login first to add items to your cart', {
    //         autoClose: 3000, // Adjust the duration as needed
    //     });

    //     return null; // Render nothing while showing the toast
    // }

    useEffect(() => {
    if (getTokenFromLocalStorage?.token === undefined) {
      // Navigate to the login page
        navigate('/login', { replace: true });

      // Delay showing the toast message
        setTimeout(() => {
            toast.error('Please login first to add items to your cart', {
            autoClose: 3000, // Adjust the duration as needed
            });
        }, 100); // Adjust the delay as needed
    }
    }, [getTokenFromLocalStorage, navigate]);

    return getTokenFromLocalStorage?.token !== undefined ? children : null;
};
