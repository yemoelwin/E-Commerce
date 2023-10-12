import React, { useState } from 'react'
import api from '../../app/api/currentApi'
import { useSelector } from 'react-redux';

const PayButton = (cartItems) => {
    console.log("cartItemData", cartItems)

    const { _id } = useSelector((state) => state.auth.users);
    const [isLoading, setLoading] = useState(false);
    const cartItemsArray = Array.isArray(cartItems.cartData) ? cartItems.cartData : [cartItems.cartData];
    console.log("cartItemsArray", cartItemsArray);

    const handleCheckout = async () => {
        console.log(cartItems)
        try {
            setLoading(true);
            const response = await api.post(`/stripe/create-payment-intent`, {
                cartItems: cartItemsArray,
                userId: _id,
            })
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                console.error('No URL found in the response.');
            }
        } catch (error) {
            console.log(error, 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button onClick={() => handleCheckout()} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Check Out'}
            </button>
        </>
    )
}

export default PayButton;