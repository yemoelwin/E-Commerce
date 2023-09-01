import React from 'react'
import Meta from '../components/common/Meta'
import BreadCrumb from '../components/common/BreadCrumb'
import Container from '../components/common/Container'

const RefundPolicy = () => {
    return (
        <>
            <Meta title= {'Refund Policy'}></Meta>
            <BreadCrumb title='Refund Policy'></BreadCrumb>
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

export default RefundPolicy