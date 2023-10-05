import React, { useEffect, useState } from 'react';
import Container from '../components/common/Container';
import Meta from '../components/common/Meta';
import BreadCrumb from '../components/common/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist } from '../features/users/userSlice';
import { productResetState, removeWishlist } from '../features/products/productSlice';
import { showToast } from '../components/common/ShowToast';

const WishList = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const wishlistState = useSelector((state) => state?.user?.wishlist?.user?.wishlist);
    
    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                await dispatch(getWishlist());
            } catch (error) {
                console.error("error", error);
                throw new Error('An error occurred while fetching all user wishlist.'); // Fallback error message
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
        }
        getData();
    }, [])

    const removeWishlistItem = async (id) => {
        try {
            await dispatch(removeWishlist(id));          
            dispatch(getWishlist());
            dispatch(productResetState());
            setTimeout(() => {
                showToast('You removed the item from wishlist.', 'success')
            },[1500])
        } catch (error) {
            console.error('error', error);
            throw new Error('something went wrong while deleting the item from wishlist')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Meta title={'Wishlist'}></Meta>
            <BreadCrumb title='Wishlist'></BreadCrumb>
            <Container class1="wishlist-wrapper home-wrapper-2 py-5">
                {isLoading ? ( // Show loading indicator when isLoading is true
                    <div className='loadingX gap-3'>
                        <div className='loading-spinner'></div>
                        <div className='load'>Loading ... </div>
                    </div> 
                ) : (
                    <div className="row">
                    {wishlistState?.length === 0 && (
                        <div className='text-center fs-5 text-secondary'>Empty Wishlist</div>
                    )}
                    {
                        wishlistState?.map((item, index) => {
                            return (
                                <div className="col-3 wishlist-card-div" key={index}>
                                    <div className="wishlist-card position-relative">
                                        <img
                                            src='images/cross.svg'
                                            alt="cross"
                                            className="position-absolute cross img-fluid"
                                            onClick={() => removeWishlistItem(item?._id)}
                                        />
                                        <div className="wishlist-card-image">
                                            <img
                                                src={item?.images[0]?.url}
                                                // className="img-fluid "
                                                alt="watch"
                                            />
                                        </div>
                                        <div className="py-3 px-3">
                                            <h5 className="title" title={item?.title}>
                                                {
                                                    item?.title?.length > 15 ? (() => {
                                                        const truncatedTitle = item?.title.substr(0, 30);
                                                        const lastSpaceIndex = truncatedTitle.lastIndexOf(" ");
                                                        if (!lastSpaceIndex) {
                                                        return `${truncatedTitle}...`;
                                                        }
                                                        return `${truncatedTitle.substr(0, lastSpaceIndex)}...`;
                                                    })() : item?.title
                                                }
                                            </h5>
                                            <h6 className="price">
                                                ${item?.price}
                                            </h6>
                                            <h6 className="color">
                                                <span className='column'>Color:</span> {item?.color[0]?.label}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    

                </div>
                )}
                
            </Container>
        </>
    )
}

export default WishList