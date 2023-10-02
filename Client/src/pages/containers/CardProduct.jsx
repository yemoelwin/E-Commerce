import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';
import prodcompare from "../../images/prodcompare.svg";
import wish from '../../images/wish.svg'
// import wishlist from "../images/wishlist.svg";
import watch2 from "../../images/watch-1.avif";
import addcart from "../../images/add-cart.svg";
import view from "../../images/view.svg";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlistProduct, productResetState } from '../../features/products/productSlice';
import { showToast } from '../../components/common/ShowToast';

const CardProduct = (props) => {
    const { grid, prodData } = props;
    let location = useLocation();
    const dispatch = useDispatch();
    const wishlistState = useSelector((state) => state.product.wishlistProduct)

    const handleWishlist = async (prodId) => {
        alert(prodId);
        try {
            await dispatch(addToWishlistProduct(prodId));
            if (wishlistState.message) {
                showToast(wishlistState.message, 'info');
            } 
        } catch (error) {
            console.error('error', error);
            throw new Error('Something went wrong while adding item to wishlist')
        }
    }

    // useEffect(() => {
    //     if (wishlistState.message) {
    //         showToast(wishlistState.message);
    //     } else {
    //         dispatch(productResetState());
    //     }
    // }, [wishlistState]);

    // alert (location)
    return (
        <>
            {
                prodData?.map((item, index) => {
                    return (
                        <div className={`${location.pathname === '/product' ? `gr-${grid}` : "col-3"}`}
                            key={index}
                        >
                            <Link
                                // to={`${
                                // location.pathname === "/"
                                // ? "/product/:id"
                                // : location.pathname === "/product/:id"
                                // ? "/product/:id"
                                // : ":id"}`}
                                className="product-card position-relative">

                                <div className="wishlist-icon position-absolute">
                                    <button
                                        className='border-0 bg-transparent'
                                        onClick={(e) => handleWishlist(item?._id)}
                                    >
                                        <img src={wish} alt="wishlist" />
                                    </button>
                                </div>

                                <div className="product-image">
                                    <img src={item.images[0].url} className='img-fluid mx-auto' alt='product' />
                                    <img src={watch2} className='img-fluid mx-auto' alt='product' />
                                </div>

                                <div className="product-details">
                                    <h6 className="brand">Harvels</h6>
                                    <h5 className="product-title">{item.title}</h5>
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        // value={item.totalrating.toString()}
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
                                        <button className='mb-1 border-0 bg-transparent'>
                                            <img src={prodcompare} alt="addcart" />
                                        </button>
                                        <button className='mb-1 border-0 bg-transparent'>
                                            <img src={view} alt="addcart" />
                                        </button>
                                        <button className='mb-1 border-0 bg-transparent'>
                                            <img src={addcart} alt="addcart" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
        </>
    )
}

export default CardProduct