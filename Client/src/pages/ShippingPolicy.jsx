import React from 'react'
import Meta from '../containers/common/Meta'
import BreadCrumb from '../containers/common/BreadCrumb'
import Container from '../containers/common/Container'

const ShippingPolicy = () => {
    return (
        <>
            <Meta title= {'Shipping Policy'}></Meta>
            <BreadCrumb title='Shipping Policy'></BreadCrumb>
            <Container class1="policy-wrapper py-5 home-wrapper-2">
                <div className="row">
                <div className="col-12">
                    <div className="policy"></div>
                </div>
                </div>
            </Container>
        </>
    )
}

export default ShippingPolicy