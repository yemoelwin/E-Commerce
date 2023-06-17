import React from 'react'
import Meta from '../components/Product/Meta'
import BreadCrumb from '../components/Product/BreadCrumb';
import CompareProductPage from '../components/NavbarLink/CompareProductPage';

const CompareProducts = () => {
    return (
        <>
            <Meta title={'Compare-Products'}></Meta>
            <BreadCrumb title={'Compare-Products'}></BreadCrumb>
            <CompareProductPage />
        </>
    )
}

export default CompareProducts