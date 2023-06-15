import React from 'react'
import Meta from '../components/Product/Meta'
import BreadCrumb from '../components/Product/BreadCrumb'
import WishList from '../components/NavbarLink/WishList';

const MyWishList = () => {
    return (
        <>
            <Meta title={'Wishlist'}></Meta>
            <BreadCrumb title='Wishlist'></BreadCrumb>
            <WishList/>
        </>
    )
}

export default MyWishList