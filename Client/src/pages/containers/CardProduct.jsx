import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import prodcompare from "../../images/prodcompare.svg";
import wish from '../../images/wish.svg'
import addcart from "../../images/add-cart.svg";
import view from "../../images/view.svg";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlistProduct, addToWishListReset } from '../../features/products/productSlice';
import { showToast } from '../../components/common/ShowToast';

const CardProduct = (props) => {
    const { grid, prodData } = props;
    let location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addToWishlistMessage = useSelector((state) => state?.product?.addToWishList);
    const message = addToWishlistMessage?.message;

    useEffect(() => {
        if (message && !message.includes('already exists')) {
            showToast(message, 'success')
        } else if(message){
            showToast(message, 'info');
        }
        dispatch(addToWishListReset());
    }, [message, dispatch])

    const handleWishlist = async(prodId) => {
        alert(prodId);
        try {
            await dispatch(addToWishlistProduct(prodId));
        } catch (error) {
            console.error('error', error);
            throw new Error('Something went wrong while adding item to wishlist')
        }
    }

    return (
        <>
            {
                prodData?.map((item, index) => {
                    return (
                        <div className={`${location.pathname === '/product' ? `gr-${grid}` : "col-3"}`}
                            key={index}
                        >
                            <div className="product-card position-relative">

                                <div className="product-image">
                                    <img src={item.images[0].url} className='img-fluid mx-auto' alt='product' />
                                    {/* <img src={watch2} className='img-fluid mx-auto' alt='product' /> */}
                                </div>

                                <div className="product-details">
                                    <h6 className="brand">{item.brand}</h6>
                                    <h5 className="product-title">{item.title}</h5>
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        value={parseFloat(item.totalrating)} 
                                        edit={false}
                                        activeColor="#ffd700"
                                    />
                                    <p className={`description ${grid === 12 ? "d-block" : "d-none"}`}>
                                        {item.description}
                                    </p>
                                    <p className="price">{`$ ${item.price }`}</p>
                                </div>

                                <div className="action-bar position-absolute">
                                    
                                    <div className="d-flex flex-column">
                                        <button
                                            className='mb-1 border-0 bg-transparent '
                                            onClick={(e) => {
                                                handleWishlist(item?._id);
                                                // handleShowMessage();
                                            }}
                                        >
                                            <img src={wish} alt="wishlist"/>
                                        </button>

                                        <button className='mb-1 border-0 bg-transparent'>
                                            <img src={prodcompare} alt="addcart" />
                                        </button>

                                        <button className='mb-1 border-0 bg-transparent'>
                                            <img onClick={() => navigate(`/product/${item._id}`)} src={view} alt="addcart" />
                                        </button>

                                        <button className='mb-1 border-0 bg-transparent'>
                                            <img src={addcart} alt="addcart" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default CardProduct