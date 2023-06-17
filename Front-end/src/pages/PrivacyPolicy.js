import React from 'react'
import Meta from '../components/Product/Meta'
import BreadCrumb from '../components/Product/BreadCrumb'
import Container from '../components/Container/Container'

const PrivacyPolicy = () => {
    return (
        <>
            <Meta title={'Privacy Policy'}></Meta>
            <BreadCrumb title='Privacy Policy'></BreadCrumb>
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

export default PrivacyPolicy