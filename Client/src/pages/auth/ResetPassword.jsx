import React, { useEffect, useRef } from 'react'
import Meta from '../../containers/common/Meta'
import BreadCrumb from '../../containers/common/BreadCrumb';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../containers/common/ShowToast';
import { useNavigate, useParams } from 'react-router-dom';
import { resetNewPassword } from '../../features/auth/AuthSlice';

let schema = yup.object().shape({
    password: yup
        .string()
        .required("Password is Required")
        .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
        .string()
        .required("Confirm Password is Required")
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
const ResetPassword = () => {
    const userRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, uniqueToken } = useParams();
    console.log('userId', id);
    console.log('uniqueToken', uniqueToken);
    const { isLoading, errorMessage } = useSelector((state) => state.auth);

    const formik = useFormik({
        initialValues : {
            password: '',
            confirmPassword: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                const data = { userId: id, uniqueToken: uniqueToken, password: values.password}
                const response = await dispatch(resetNewPassword(data));
                if (response.error) {
                    showToast('Something went wrong and try again.', 'error')
                } else {
                    showToast('Password has been changed successfully.Pls log in with new password', 'success')
                    formik.resetForm();
                    navigate('/login')
                }
            } catch (error) {
                console.error('Error occurred while resetting password:', error);
            }
        }
    })

    return (
        <>
            <Meta title={"Reset Password"} />
            <BreadCrumb title='Reset Password'></BreadCrumb>
            <div className="form-bg">
                <div className="container d-flex justify-content-center">
                    <div className="form-container">
                        <p className={errorMessage ? 'errmsg' : 'offscreen'} aria-live='assertive'>
                            {errorMessage}
                        </p>
                        <h3 className="title">Enter New Password</h3>
                        {/* <span className="description">We will send you an email to reset your password</span> */}
                        <form className="form-horizontal" onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control auth-input"
                                    placeholder="New Password"
                                    id='password'
                                    name='password'
                                    ref={userRef}
                                    onChange={(e) => formik.handleChange(e)}
                                    onBlur={formik.handleBlur("password")}
                                    value={formik.values.password}
                                    autoComplete='off'
                                    required
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className='error_message labelName'>
                                        {formik.errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control auth-input"
                                    placeholder="Confirm Password"
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    ref={userRef}
                                    onChange={(e) => formik.handleChange(e)}
                                    onBlur={formik.handleBlur("confirmPassword")}
                                    value={formik.values.confirmPassword}
                                    autoComplete='off'
                                    required
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className='error_message labelName'>
                                        {formik.errors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    className="btn"
                                    type='submit'>{isLoading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>




                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword