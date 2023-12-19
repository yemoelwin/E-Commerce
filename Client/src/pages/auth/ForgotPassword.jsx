import React, { useEffect, useRef } from "react";
import Meta from "../../containers/common/Meta";
import BreadCrumb from "../../containers/common/BreadCrumb";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { showToast } from "../../containers/common/ShowToast";
import {
	clearErrorMessage,
	forgotPasswordToken,
} from "../../features/auth/AuthSlice";

let schema = yup.object().shape({
	email: yup
		.string()
		.nullable()
		.required("Email is required")
		.email("please include an `@` in an email address"),
});

const ForgotPassword = () => {
	const userRef = useRef();
	const dispatch = useDispatch();
	const { isLoading, isError, errorMessage } = useSelector(
		(state) => state.auth,
	);

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: schema,
		onSubmit: async (values) => {
			try {
				const response = await dispatch(forgotPasswordToken(values));
				if (response.error) {
					showToast("Something went wrong.", "error");
				} else {
					showToast(
						"A reset password link has been sent to your email.",
						"info",
					);
					formik.resetForm();
				}
			} catch (error) {
				console.error("Error occurred while resetting password:", error);
			}
		},
	});

	const handleChange = (e) => {
		formik.handleChange(e);
		removeErrorMessage();
	};

	useEffect(() => {
		userRef.current.focus();
	}, []);

	const removeErrorMessage = () => {
		if (isError) {
			dispatch(clearErrorMessage());
		}
	};

	useEffect(() => {
		return () => {
			removeErrorMessage();
		};
	}, []);

	return (
		<>
			<Meta title={"Forgot Password"} />
			<BreadCrumb title='Forgot Password'></BreadCrumb>
			<div className='form-bg'>
				<div className='container d-flex justify-content-center'>
					<div className='form-container'>
						<p
							className={errorMessage ? "errmsg" : "offscreen"}
							aria-live='assertive'
						>
							{errorMessage}
						</p>
						<h3 className='title'>Reset Your Password</h3>
						<span className='description'>
							We will send you an email to reset your password
						</span>
						<form className='form-horizontal' onSubmit={formik.handleSubmit}>
							<div className='form-group'>
								<input
									type='email'
									className='form-control auth-input'
									placeholder='Email'
									id='email'
									name='email'
									ref={userRef}
									onChange={handleChange}
									onBlur={formik.handleBlur("email")}
									value={formik.values.email}
									autoComplete='off'
									required
								/>
								{formik.touched.email && formik.errors.email && (
									<div className='error_message labelName'>
										{formik.errors.email}
									</div>
								)}
							</div>

							<div>
								<button className='btn' type='submit'>
									{isLoading ? "Submitting..." : "Submit"}
								</button>
								<Link to={"/login"} className='forgot-password-cancel'>
									Cancel
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
