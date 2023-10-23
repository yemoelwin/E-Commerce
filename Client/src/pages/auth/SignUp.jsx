import React, { useState } from 'react'
import Meta from '../../containers/common/Meta'
import BreadCrumb from '../../containers/common/BreadCrumb'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/auth/AuthSlice';
import { toast } from 'react-toastify';

let schema = yup.object().shape({
    firstname: yup.string().required("First Name is Required"),
    lastname: yup.string().required("Last Name is Required"),
    email: yup.string().nullable().required('Email is required').email('please include an `@` in an email address'),
    password: yup
        .string()
        .required("Password is Required")
        .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
        .string()
        .required("Confirm Password is Required")
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    mobile: yup.string().required("Mobile number is Required"),
});

const SignUp = () => {
    const dispatch = useDispatch();
    const [ showMessage ] = useState('Please check your email inbox for a verification link. Click on the link to confirm your email address and complete the registration process.')
    const { isLoading, isSuccess, isError, errorMessage } = useSelector((state) => state.auth);

    const formik = useFormik({
        initialValues : {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            mobile: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                const response = await dispatch(register(values));
                if (response.error) {
                    toast.error('Email registration failed.')
                } else {
                    toast.success('Your email has been registered.')
                    formik.resetForm();
                }
            } catch (error) {
                console.error('Error occurred while signing up email:', error);
            }
        }
    })

    return (
        <>
            <Meta title= 'Sign Up'></Meta>
            <BreadCrumb title='Sign Up'></BreadCrumb>
            <div className="form-bg">
                <div className="container d-flex justify-content-center">
                    <div className="form-containerX">
                        {/* <div className="verifyMessage">{showMessage}</div> */}
                        {isSuccess ? (
                            <div className="verifyMessage">{showMessage}</div>
                        ) : (
                            isError && errorMessage ? (
                                <div className="errMessage">{errorMessage}</div>
                        ) : null)}
                        
                        <h3 className="title">Register Your Account</h3>
                            
                        <form className="form-horizontal" onSubmit={formik.handleSubmit}>

                            {/* Name */}
                            <div className='form-groupX'>
                                <div className='form-rte'>
                                    <label htmlFor="firstname" className='labelName'>First Name</label>
                                    <input
                                        type="name"
                                        className="form-control auth-input"
                                        placeholder="First Name"
                                        id='firstname'
                                        name='firstname'
                                        onChange={formik.handleChange("firstname")}
                                        onBlur={formik.handleBlur("firstname")}
                                        value={formik.values.firstname}
                                        required
                                    />
                                    {formik.touched.firstname && formik.errors.firstname && (
                                        <div className='error_message labelName'>
                                            {formik.errors.firstname}
                                        </div>
                                    )}
                                </div>
                                
                                
                                <div className='form-rte'>
                                    <label htmlFor="lastname" className='labelName'>Last Name</label>
                                    <input
                                        type="name"
                                        className="form-control auth-input"
                                        placeholder="Last Name"
                                        id='lastname'
                                        name='lastname'
                                        onChange={formik.handleChange("lastname")}
                                        onBlur={formik.handleBlur("lastname")}
                                        value={formik.values.lastname}
                                        required
                                    />
                                    {formik.touched.lastname && formik.errors.lastname && (
                                        <div className='error_message labelName'>
                                            {formik.errors.lastname}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className='form-group'>
                                <label htmlFor="email" className='labelName'>Email</label>
                                <input
                                        type="email"
                                        className="form-control auth-input"
                                        placeholder="Email"
                                        id='email'
                                        name='email'
                                        onChange={formik.handleChange("email")}
                                        onBlur={formik.handleBlur("email")}
                                        value={formik.values.email}
                                        required
                                />
                                <div className='error_message labelName'>
                                    {formik.touched.email && formik.errors.email}
                                </div>
                            </div>
                            
                            {/* Password */}
                            <div className='form-group'>
                            <label htmlFor="mobile" className='labelName'>Password</label>
                                <input
                                        type="password"
                                        className="form-control auth-input"
                                        placeholder="Password"
                                        id='password'
                                        name='password'
                                        onChange={formik.handleChange("password")}
                                        onBlur={formik.handleBlur("password")}
                                        value={formik.values.password}
                                        required
                                />
                                <div className='error_message labelName'>
                                    {formik.touched.password && formik.errors.password}
                                </div>
                            </div>
                            
                            {/* Confirm Password */}
                            <div className='form-group'>
                            <label htmlFor="confirm_password" className='labelName'>Confirm Password</label>
                                <input
                                        type="password"
                                        className="form-control auth-input"
                                        placeholder="Confirm Password"
                                        id='confirm_password'
                                        name='confirm_password'
                                        onChange={formik.handleChange("confirmPassword")}
                                        onBlur={formik.handleBlur("confirmPassword")}
                                        value={formik.values.confirmPassword}
                                        required
                                />
                                <div className='error_message labelName'>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword}
                                </div>
                            </div>
                            
                            {/* Mobile  */}
                            <div className='form-group'>
                            <label htmlFor="mobile" className='labelName'>Mobile Number</label>
                                <input
                                    type="tel"
                                    className="form-control auth-input"
                                    placeholder="Mobile"
                                    id='mobile'
                                    name='mobile'
                                    onChange={formik.handleChange("mobile")}
                                    onBlur={formik.handleBlur("mobile")}
                                    value={formik.values.mobile}
                                    required
                                />
                                <div className='error_message labelName'>
                                    {formik.touched.mobile && formik.errors.mobile}
                                </div>
                            </div>
                            
                                
                            <button className="btn" type='submit'>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp

// Render Prop
// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';

// const Basic = () => (
//     <div className="form-bg">
//         <div className="container d-flex justify-content-center">
//         <h1>Register Account</h1>
//         <Formik
//             initialValues={{ email: '', password: '' }}
//             validate={values => {
//                 const errors = {};
//                 if (!values.email) {
//                 errors.email = 'Required';
//                 } else if (
//                 !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
//                 ) {
//                 errors.email = 'Invalid email address';
//                 }
//                 return errors;
//             }}
//             onSubmit={(values, { setSubmitting }) => {
//                 setTimeout(() => {
//                 alert(JSON.stringify(values, null, 2));
//                 setSubmitting(false);
//                 }, 400);
//             }}
//         >
//         {({ isSubmitting }) => (
//             <Form>
//                 <Field className='form-control' type="email" name="email" />
//                 <ErrorMessage name="email" component="div" />
//                 <Field className='form-control' type="password" name="password" />
//                 <ErrorMessage name="password" component="div" />
//                 <button className="btn" type="submit" disabled={isSubmitting}>
//                     Submit
//                 </button>
//             </Form>
//         )}
//         </Formik>
//         </div>
        
//     </div>
// );

// export default Basic;

// {/* <label htmlFor="countryCode">Country Code</label>
//                                 <select
//                                     className="form-control"
//                                     id="countryCode"
//                                     name="countryCode"
//                                     required
//                                 >
//                                     <option value="+1">+1 (United States)</option>
//                                     <option value="+44">+44 (United Kingdom)</option>
//                                     <option value="+91">+91 (India)</option>
//                                     <option value="+91">+65 (Singapore)</option>
//                                     <option value="+91">+95 (Myanmar)</option>
//                                     <option value="+91">+91 (India)</option>
//                                 </select> */}