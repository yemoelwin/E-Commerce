import React, { useState } from "react";
// import Maps from './Maps';
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall, BiInfoCircle } from "react-icons/bi";
import Container from "../containers/common/Container";
import Meta from "../containers/common/Meta";
import BreadCrumb from "../containers/common/BreadCrumb";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createContact } from "../features/inquiry/inquirySlice";
import { showToast } from "../containers/common/ShowToast";
import ReCAPTCHA from "react-google-recaptcha";

let schema = yup.object().shape({
	name: yup.string().required("Name is Required"),
	email: yup
		.string()
		.nullable()
		.required("Email is required")
		.email("please include an `@` in an email address"),
	mobile: yup.string().required("Mobile number is Required"),
	comments: yup
		.string()
		.required("Fill the comment box that you want to know!"),
});
const ContactUs = () => {
	const dispatch = useDispatch();

	const { isLoading } = useSelector((state) => state.inquiry);

	const [captchaValue, setCaptchaValue] = useState([]);

	const recaptchaRef = React.useRef();

	const site_key = "6Lf6VzwpAAAAAAqBf730JHS8c_qbbSxajGoDk-D9";

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			mobile: "",
			comments: "",
		},
		validationSchema: schema,
		onSubmit: async (values) => {
			try {
				const response = await dispatch(
					createContact({ values, captchaValue: captchaValue }),
				);
				recaptchaRef.current.reset();
				if (response.error) {
					showToast("Something went wrong.", "error");
				} else {
					showToast("Your inquiry has been sent successfully.");
					formik.resetForm();
				}
			} catch (error) {
				console.error("Error", error);
				throw new Error("Error occurred while sending inquiry");
			}
		},
	});

	const onChange = (value) => {
		console.log("value", value);
		setCaptchaValue(value);
	};

	return (
		<>
			<Meta title={"Contact Us"} />
			<BreadCrumb title='Contact Us' />
			<Container class1='contact-wrapper py-5 home-wrapper-2'>
				<div className='row'>
					<div className='col-12'>{/* <Maps />             */}</div>

					<div className='col-12 mt-5'>
						<div className='contact-inner-wrapper d-flex justify-content-between'>
							<div>
								<h3 className='contact-title mt-4'>Contact</h3>
								<form
									onSubmit={formik.handleSubmit}
									className='d-flex flex-column gap-15 mt-4'
								>
									<div>
										<input
											type='name'
											className='form-control'
											placeholder='Name'
											style={{ height: "50px" }}
											id='name'
											name='name'
											onChange={formik.handleChange("name")}
											onBlur={formik.handleBlur("name")}
											value={formik.values.name}
											required
										/>
										{formik.touched.name && formik.errors.name && (
											<div className='error_message labelName'>
												{formik.errors.name}
											</div>
										)}
									</div>

									<div>
										<input
											type='email'
											className='form-control'
											placeholder='Email'
											style={{ height: "50px" }}
											id='email'
											name='email'
											onChange={formik.handleChange("email")}
											onBlur={formik.handleBlur("email")}
											value={formik.values.email}
											required
										/>
										{formik.touched.email && formik.errors.email && (
											<div className='error_message labelName'>
												{formik.errors.email}
											</div>
										)}
									</div>

									<div>
										<input
											type='mobile'
											className='form-control'
											placeholder='Mobile'
											style={{ height: "50px" }}
											id='mobile'
											name='mobile'
											onChange={formik.handleChange("mobile")}
											onBlur={formik.handleBlur("mobile")}
											value={formik.values.mobile}
											required
										/>
										{formik.touched.mobile && formik.errors.mobile && (
											<div className='error_message labelName'>
												{formik.errors.mobile}
											</div>
										)}
									</div>

									<div>
										<textarea
											name='comments'
											id='comments'
											className='w-100 form-control'
											cols='30'
											rows='5'
											style={{ height: "150px" }}
											placeholder='Comments'
											onChange={formik.handleChange("comments")}
											onBlur={formik.handleBlur("comments")}
											value={formik.values.comments}
											required
										></textarea>
										{formik.touched.comments && formik.errors.comments && (
											<div className='error_message labelName'>
												{formik.errors.comments}
											</div>
										)}
									</div>

									<div>
										<ReCAPTCHA
											ref={recaptchaRef}
											sitekey={site_key}
											onChange={onChange}
										/>
									</div>

									<div>
										<button type='submit' className='button border-0'>
											{isLoading ? "Submitting..." : "Submit"}
										</button>
									</div>
								</form>
							</div>

							{/* Location email and mobile number */}
							<div>
								<h3 className='contact-title mt-4'>Get in Touch With Us</h3>
								<div className='mt-4'>
									<ul className='ps-0'>
										<li className='mb-3 d-flex align-items-center gap-15'>
											<AiOutlineHome className='fs-5 ' />
											<address className='mb-0'>
												No-8, Park street, Near School Bus-stop, Kamayut
												Township
											</address>
										</li>
										<li className='mb-3 d-flex align-items-center gap-15'>
											<BiPhoneCall className='fs-5 ' />
											<Link to='tel:+95 9257879097'>+95 9257879097</Link>
										</li>
										<li className='mb-3 d-flex align-items-center gap-15'>
											<AiOutlineMail className='fs-5' />
											<Link to='mailto:yemoelwin142@gmail.com'>
												yemoelwin142@gmail.com
											</Link>
										</li>
										<li className='mb-3 d-flex align-items-center gap-15'>
											<BiInfoCircle className='fs-5' />
											<p className='mb-0'>Monday - Friday, 9AM - 7PM</p>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};

export default ContactUs;
