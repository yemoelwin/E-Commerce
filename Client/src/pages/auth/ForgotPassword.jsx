import React from 'react'
import Meta from '../../containers/common/Meta'
import BreadCrumb from '../../containers/common/BreadCrumb';
import CustomInput from '../../containers/common/CustomInput';
import Container from '../../containers/common/Container'
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <>
            <Meta title={'Forgot Password'}></Meta>
            <BreadCrumb title='Forgot Password'></BreadCrumb>
            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                <div className="col-12">
                    <div className="auth-card">
                    <h3 className="text-center mb-3">Reset Your Password</h3>
                    <p className="text-center mt-2 mb-3">
                        We will send you an email to reset your password
                    </p>
                    <form action="" className="d-flex flex-column gap-15">
                        <CustomInput type="email" name="email" placeholder="Email" />

                        <div>
                        <div className="mt-3 d-flex justify-content-center flex-column gap-15 align-items-center">
                            <button className="button border-0" type="submit">
                            Submit
                            </button>
                            <Link to="/login">Cancel</Link>
                        </div>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </Container>
        </>
    )
}

export default ForgotPassword