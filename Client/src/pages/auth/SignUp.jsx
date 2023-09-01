import React from 'react'
import Meta from '../../components/common/Meta'
import BreadCrumb from '../../components/common/BreadCrumb'
// import { Link } from 'react-router-dom'
import Container from '../../components/common/Container'
import CustomInput from '../../components/common/CustomInput'

const SignUp = () => {
    return (
        <>
            <Meta title= 'Sign Up'></Meta>
            <BreadCrumb title= 'Sign Up'></BreadCrumb>
            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                <div className="col-12">
                    <div className="auth-card">
                    <h3 className="text-center mb-3">Sign Up</h3>
                    <form action="" className="d-flex flex-column gap-15">
                        <CustomInput type="text" name="name" placeholder="First Name" />
                        <CustomInput type="text" name="name" placeholder="Last Name" />
                        <CustomInput type="email" name="email" placeholder="Email" />
                        <CustomInput
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        />
                        <CustomInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        />
                        <div>
                        <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                            <button className="button border-0">Sign Up</button>
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

export default SignUp