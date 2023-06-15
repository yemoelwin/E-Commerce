import React from 'react'
import Meta from '../components/Product/Meta'
import BreadCrumb from '../components/Product/BreadCrumb'
import LogIn from '../components/NavbarLink/LogIn';

const Login = () => {
    return (
        <>
            <Meta title={'Login'}></Meta>
            <BreadCrumb title='Login'></BreadCrumb>
            <LogIn />
        </>
    )
}

export default Login