import React, { useEffect, useState } from 'react'
import Meta from '../components/common/Meta'
import BreadCrumb from '../components/common/BreadCrumb'
import { MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getCart, updateQuantity } from '../features/cart/cartSlice';

const CartX = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const cartState = useSelector((state) => state?.cart?.items);
    const quantityState = useSelector((state) => state?.cart?.quantities);
    const [quantities, setQuantities] = useState(quantityState); 
    console.log(quantities)
    console.log(quantityState)

    useEffect(() => {
        const getUserCart = async () => {
            try {
                setIsLoading(false);
                await dispatch(getCart());
            } catch (error) {
                console.error('error', error);
                setIsLoading(false);    
                throw new Error('Something went wrong!');
            }
        };
        getUserCart();
    }, []);

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
        dispatch(updateQuantity({ productId, quantity: newQuantity}))
    };

    const deleteItem = async (id) => {
        try {
            setIsLoading(true);
            // await dispatch(deleteCartItem(id));
            // await dispatch(getCart());
        } catch (error) {
            console.error('error', error)
            throw new Error('Something went wrong')
        } finally {
            setIsLoading(false);
        }
        
    }
    return (
        <>
            <Meta title={"Cart"} />
            <BreadCrumb title="Cart" />
            <div className="cart-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            
                            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
                                <h4 className="cart-col-1">Product</h4>
                                <h4 className="cart-col-2">Price</h4>
                                <h4 className="cart-col-3">Quantity</h4>
                                <h4 className="cart-col-4">Total</h4>
                            </div>
                            
                            {isLoading ? ( // Show loading indicator when isLoading is true
                                <div className='gap-3 loadingM'>
                                    <div className='loading-spinner'></div>
                                    <div className='load'>Loading ... </div>
                                </div>
                            ) : (
                                cartState && cartState.map((item, index) => {
                                    return (
                                        <div className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center" key={index}>
                                            <div className="cart-col-1 gap-15 d-flex align-items-center">

                                                <div className="w-25 cart-image">
                                                    <img
                                                        src={item?.productId?.images[0]?.url}
                                                        className="img-fluid"
                                                        alt="productImage"
                                                    />
                                                </div>
                                                <div className="w-75">
                                                    <p>{item?.productId?.title}</p>
                                                    <p>Size: hgf</p>
                                                    <p>Color: {item?.color}</p>
                                                </div>
                                            </div>

                                            <div className="cart-col-2">
                                                <h5 className="price fs-6">$ {item?.productId?.price}</h5>
                                            </div>

                                            <div className="cart-col-3 d-flex align-items-center gap-15">
                                                <div>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        name="number"
                                                        min={1}
                                                        max={99}
                                                        id={`quantity-${item._id}`}
                                                        value={quantities[item._id] !== undefined ? quantities[item._id] : item?.quantity}
                                                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))}
                                                    />
                                                </div>
                                                <div className='deleteButton'>
                                                    <MdDelete
                                                        className="text-danger fs-4"
                                                        onClick={() => deleteItem(item?._id)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="cart-col-4">
                                                <h5 className="price fs-6">
                                                    ${quantities[item._id] !== undefined ? item.price * quantities[item._id] : item.price * item.quantity}
                                                </h5>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                        </div>

                        <div className="col-12 py-2 mt-4">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <Link to="/product" className="button">
                                    Continue To Shopping
                                </Link>
                                <div className="d-flex flex-column align-items-end">
                                    <h4>SubTotal: $ 1000</h4>
                                    <p>Taxes and shipping calculated at checkout</p>
                                    <Link to="/checkout" className="button">
                                    Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartX