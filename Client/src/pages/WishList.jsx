import React, { useEffect } from 'react';
import Container from '../components/common/Container';
import Meta from '../components/common/Meta';
import BreadCrumb from '../components/common/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist } from '../features/users/userSlice';
// import { remove } from '../features/products/productSlice';
import { removeWishlist } from '../features/products/productSlice';
import { showToast } from '../components/common/ShowToast';

const WishList = () => {

    const dispatch = useDispatch();
    const wishlistState = useSelector((state) => state?.user?.wishlist?.user?.wishlist);
    
    useEffect(() => {
        const getData = async () => {
            try {
                await dispatch(getWishlist());
            } catch (error) {
                console.error("error", error);
                throw new Error('An error occurred while fetching all user wishlist.'); // Fallback error message
            }
        }
        getData();
    }, [])

    const removeWishlistItem = async (id) => {
        try {
            await dispatch(removeWishlist(id));
            setTimeout(() => {
                showToast('You removed the item from wishlist.')
                dispatch(getWishlist());
            },[400])
        } catch (error) {
            console.error('error', error);
            throw new Error('something went wrong while deleting the item from wishlist')
        }
    }

    return (
        <>
            <Meta title={'Wishlist'}></Meta>
            <BreadCrumb title='Wishlist'></BreadCrumb>
            <Container class1="wishlist-wrapper home-wrapper-2 py-5">
                <div className="row">

                    {
                        wishlistState?.map((item, index) => {
                            return (
                                <div className="col-3" key={index}>
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
                                        className="img-fluid w-100"
                                        alt="watch"
                                        />
                                    </div>
                                    <div className="py-3 px-3">
                                        <h5 className="title">
                                            {item?.title}
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
            </Container>
        </>
    )
}

export default WishList