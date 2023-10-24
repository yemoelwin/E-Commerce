import React, { useEffect, useState } from 'react'
import api from '../app/api/currentApi'
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../features/users/userSlice';
import { v4 as uuidv4 } from 'uuid';

const PayButton = (cartData) => {
    const dispatch = useDispatch();
    const { _id } = useSelector((state) => state.auth.users);
    console.log('userId', _id)
    const [isLoading, setLoading] = useState(false);
    const [transitionId, setTransitionId] = useState('');

    useEffect(() => {
        const generatedTransitionId = uuidv4();
        setTransitionId(generatedTransitionId);
    }, []);
    
    const handleConfirm = async () => {
        try {
            setLoading(true);

            await dispatch(createOrder({...cartData, transitionId}));

            const response = await api.post(`/stripe/create-payment-intent`, {
                cartItemData: cartData,
                userId: _id,
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

