import React from 'react'
import Meta from '../containers/common/Meta'
import BreadCrumb from '../containers/common/BreadCrumb'
import Container from '../containers/common/Container';

const TermAndConditions = () => {
    return (
        <>
            
            <Meta title={"Term And Conditions"} />
            <BreadCrumb title="Term And Conditions" />
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

export default TermAndConditions