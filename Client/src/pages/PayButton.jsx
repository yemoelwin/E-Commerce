import React, { useEffect, useState } from 'react'
import api from '../app/api/currentApi'
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../features/users/userSlice';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const PayButton = (cartData) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector((state) => state?.auth?.users);
    const [isLoading, setLoading] = useState(false);
    const [transitionId, setTransitionId] = useState('');
    const userId = authState?._id;
    console.log('autStateUserId', authState?._id)

    useEffect(() => {
        const generatedTransitionId = uuidv4();
        setTransitionId(generatedTransitionId);
    }, []);

    useEffect(() => {
        if (!authState || !authState._id) {
            navigate('/login');
        }
    }, [authState, navigate]);
    
    const handleConfirm = async () => {
        try {   
            setLoading(true);

            await dispatch(createOrder({...cartData, transitionId}));

            const response = await api.post(`/stripe/create-payment-intent`, {
                cartItemData: cartData,
                userId: authState._id,
                transitionId,
            })
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                console.error('No URL found in the response.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error in handleConfirm:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={handleConfirm}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Confirm'}
            </button>
            
        </>
    )
}

export default PayButton;

