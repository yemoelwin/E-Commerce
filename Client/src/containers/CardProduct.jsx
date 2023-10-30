import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';
import prodcompare from "../images/prodcompare.svg";
import wish from '../images/wish.svg'
import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import { useDispatch } from 'react-redux';
import { addToWishlistProduct } from '../features/products/productSlice';

const CardProduct = (props) => {
    const { grid, prodData } = props;
    console.log('prodData', prodData)
    let location = useLocation();
    const dispatch = useDispatch();

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
                                    {item.images && item.images.length > 0 && (
                                        <img src={item.images[0].url} className='img-fluid mx-auto' alt='product' />
                                    )}
                                    {/* <img src={watch2} className='img-fluid mx-auto' alt='product' /> */}
                                </div>

                                <div className="product-details">
                                    <h6 className="brand">{item.brand}</h6>
                                    <h5 className="product-title" title={item?.title}>

                                        {
                                            item?.title.length > 15
                                            ? (() => {
                                                const truncatedTitle = item?.title.substr(0, 50);
                                                const lastSpaceIndex = truncatedTitle.lastIndexOf(' ');
                                                if (lastSpaceIndex !== -1) {
                                                return `${truncatedTitle.substr(0, lastSpaceIndex)}...`;
                                                } else {
                                                return `${truncatedTitle}...`;
                                                }
                                            })()
                                            : item?.title
                                        }
                                        
                                    </h5>
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        value={parseFloat(item.totalrating)} 
                                        edit={false}
                                        activeColor="#ffd700"
                                    />
                                    <p className={`description ${grid === 12 ? "d-block" : "d-none"}`} description = {item.description}>

                                        {
                                            item?.description.length > 15
                                            ? (() => {
                                                const truncatedDescription = item?.description.substr(0, 300);
                                                const lastSpaceIndex = truncatedDescription.lastIndexOf(' ');
                                                if (lastSpaceIndex !== -1) {
                                                return `${truncatedDescription.substr(0, lastSpaceIndex)}...`;
                                                } else {
                                                return `${truncatedDescription}...`;
                                                }
                                            })()
                                            : item?.description
                                        }
                                    </p>
                                    <p className="price">{`$ ${item.price }`}</p>
                                </div>

                                <div className="action-bar position-absolute">
                                    
                                    <div className="d-flex flex-column action-barX">
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
                                        {/* onClick={() => navigate(`/product/${item?._id}`)} */}
                                        <Link to={`/product/${item?._id}`} className='mb-1 border-0 bg-transparent'>
                                            <img src={view} alt="addcart" />
                                        </Link>

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