// import React, { useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Meta from '../../components/common/Meta';
// import BreadCrumb from '../../components/common/BreadCrumb';
// import Container from '../../components/common/Container';
// import CustomInput from '../../components/common/CustomInput';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../../features/auth/AuthSlice';

// const Login = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     let schema = yup.object().shape({
//         email: yup.string().email('Please enter a valid email address').required('Email is required!'),
//         password: yup.string().min(8).required('Password is required!'),
//     });
//     const formik = useFormik({
//         initialValues: {
//             email: "",
//             password: "",
//         },
//         validationSchema: schema,
//         onSubmit: async (values) => {
//             try {
//                 dispatch(login(values))
//             } catch (error) {
//                 console.error('Login error:', error);
//             }
//         }
//     });

//     const authState = useSelector((state) => state.auth)
//     // console.log('authState', authState);
//     const { isSuccess, user, isLoading, isError, message } = authState
//     useEffect(() => {
//     if (isSuccess) {
//         navigate("/admin");
//     } 
// }, [isSuccess, navigate, user]);
//     return (
//         <>
//             <Meta title={'Login'}></Meta>
//             <BreadCrumb title='Login'></BreadCrumb>
            
//             <Container class1="login-wrapper py-2 home-wrapper-2">
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="auth-card border auth-marginBot">
//                             <div className='error text-center'>
//                                 {message && message.message === 'Rejected' ? 'Only admin can access' : ''}
//                             </div>
//                                 <form action="" onSubmit={formik.handleSubmit}>
//                                     <div className="error mt-2">
//                                         {formik.touched.email && formik.errors.email}
//                                     </div>
//                                     <CustomInput
//                                         type="text"
//                                         label="Email Address"
//                                         id="email"
//                                         name="email"
//                                         onChng={formik.handleChange("email")}
//                                         onBlur={formik.handleBlur("email")}
//                                         val={formik.values.email}
//                                     />
//                                     <div className="error mt-4">
//                                         {formik.touched.password && formik.errors.password}
//                                     </div>
//                                     <CustomInput
//                                         type="password"
//                                         label="Password"
//                                         id="pass"
//                                         name="password"
//                                         onChng={formik.handleChange("password")}
//                                         onBlur={formik.handleBlur("password")}
//                                         val={formik.values.password}
//                                     />                               
//                                     <button
//                                         to='/admin'
//                                         className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5 mt-4"
//                                         style={{ background: "#ffd333" }}
//                                         type="submit"
//                                         >{isLoading ? 'Logging in...' : 'Login'}
//                                     </button>
                                
//                                 </form>

//                             <div className="mb-3 text-end mt-2 ">
//                                     <Link to="/forgot-password" className="auth-margin auth-blue" style={{ fontSize: "13px", color:"blue"}}>
//                                     Forgot Password?
//                                     </Link>
//                                     <Link to="/signup" className="auth-margin auth-blue" style={{fontSize: "13px", color: 'blue'}}>
//                                     Sign Up
//                                     </Link>
//                                 </div>
//                         </div>
//                     </div>
//                 </div>
//             </Container>
//         </>
//     )
// }

// export default Login;
