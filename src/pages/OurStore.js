import React from 'react'
import BreadCrumb from '../components/Product/BreadCrumb';
import Meta from '../components/Product/Meta';
import ProductPage from '../components/Product/ProductPage';


const OurStore = () => {
    return (
        <>
            <Meta title={"Our Store"} />
            <BreadCrumb title='Our Store' />
            
            <div>
                <ProductPage/>
            </div>
        </>
    )
}

export default OurStore