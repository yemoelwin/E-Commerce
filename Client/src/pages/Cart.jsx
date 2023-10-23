import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { addToCart, clearCart, decreaseQuantity, getTotals, removeCart } from '../features/cart/cartSlice';
import PayButton from './PayButton';

const Cart = () => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state?.cart);
    console.log()

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    const handleRemoveCart = (item) => {
        try {
            dispatch(removeCart(item));
        } catch (error) {
            console.error('error', error);
            throw new Error('something went wrong')
        }
    };

    const handleDecrease = (item) => {
        try {
            dispatch(decreaseQuantity(item));
        } catch (error) {
            console.error('error', error);
            throw new Error('something went wrong')
        }
    };

    const handleIncrease = (item) => {
        try {
            dispatch(addToCart(item));
        } catch (error) {
            console.error('error', error);
            throw new Error('something went wrong')
        }
    };

    const handleClearCart = () => {
        try {
            dispatch(clearCart());
            const cartHeading = document.getElementById('shift');
            if (cartHeading) {
                cartHeading.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('error', error);
            throw new Error('something went wrong')
        }
    };

    return (
        <>
            <div className='cart_container'>
                <h2 id='shift'>Shopping Cart</h2>
                {
                    cart?.items?.length === 0 ? (
                        <div className="cart_empty">
                            <p>Your cart is empty</p>
                            <div className="start-shopping">
                                <Link to={`/product`}>
                                    <BsArrowLeft />
                                    <span>Start Shopping</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="titles">
                                <h3 className="product_title">Item</h3>       
                                <h3 className="priceX">Price</h3>    
                                <h3 className="quantityX">Quantity</h3>
                                <h3 className="action">Action</h3>
                                <h3 className="total_price">Total Price</h3>
                            </div>

                            <div className="cart_items">
                                {
                                    cart?.items?.map(cartItem => {
                                        return (
                                            <div className='cart_item' key={cartItem?.productId}>
                                                <div className="cart_product">
                                                    <img src={cartItem?.image} alt=''/>
                                                    <div className=''>
                                                        <h3 title={cartItem.title}>
                                                        { cartItem?.title?.length > 15 ? (() => {
                                                            const truncatedTitle = cartItem?.title.substr(0, 70);
                                                            const lastSpaceIndex = truncatedTitle.lastIndexOf(" ");
                                                            if (!lastSpaceIndex) {
                                                                return `${truncatedTitle}...`;
                                                            }
                                                            return `${truncatedTitle.substr(0, lastSpaceIndex)}...`;
                                                            })() : cartItem?.title
                                                        }
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="cart_product_price">
                                                    {cartItem.price}
                                                </div>

                                                <div className="cart_product_quantity">
                                                    <button onClick={() => handleDecrease(cartItem)}>-</button>
                                                    <div className='count'>
                                                        {cartItem.quantity}
                                                    </div>
                                                    <button onClick={() => handleIncrease(cartItem)}>+</button>
                                                </div>

                                                <div className='cart_button'>
                                                    <button
                                                        onClick={() => handleRemoveCart(cartItem)}
                                                    >Remove</button>
                                                </div>

                                                <div className="cart_product_total_price">
                                                    ${(cartItem.quantity * cartItem.price).toFixed(2)}
                                                </div>
                                            </div> 
                                        )
                                        
                                    })        
                                }   
                            </div>  

                            <div className='cart_summary'>
                                    <button
                                        className="clear_cart"
                                        onClick={() => handleClearCart()}
                                        to='/shift'
                                    >
                                        Clear Cart
                                    </button>
                                    <div className="checkout_cart">
                                        <div className="sub_total">
                                            <span>SubTotal</span>
                                            <span className='amount'>{(cart.cartTotalAmount).toFixed(2)}</span>
                                        </div>
                                        <p>Taxes and shipping calculated at checkout</p>
                                        <PayButton cartData={cart.items} cartTotalAmount={cart.cartTotalAmount} totalQuantity={cart.totalQuantity} />

                                        <div className="continue-shopping">
                                            <Link to={`/product`}>
                                                <BsArrowLeft className='bs_brrow_left'/>
                                                <span>Continue Shopping</span>
                                            </Link>
                                        </div>
                                    </div>
                            </div>    
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Cart