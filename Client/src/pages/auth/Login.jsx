import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Meta from "../../containers/common/Meta";
import BreadCrumb from "../../containers/common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrorMessage } from "../../features/auth/AuthSlice";

const Login = () => {
	const userRef = useRef();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { isLoading, isError, errorMessage, isAuthenticated } = useSelector(
		(state) => state.auth,
	);
	const authState = useSelector((state) => state.auth.users);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	const handleEmailChange = (e) => {
		e.preventDefault();
		setEmail(e.target.value);
		removeErrorMessage();
	};

	const handlePasswordChange = (e) => {
		e.preventDefault();
		setPassword(e.target.value);
		removeErrorMessage();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const loginData = { email, password };
			await dispatch(login(loginData));
		} catch (error) {
			console.error("Login failed:", error);
			throw new Error("Error occurred while logging in.");
		}
	};

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		} else {
			navigate("/");
		}
	}, [authState]);

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
			<Meta title={"Login"} />
			<BreadCrumb title='Login' />
			<div className='form-bg'>
				<div className='container d-flex justify-content-center'>
					<div className='form-container'>
						<p
							className={errorMessage ? "errmsg" : "offscreen"}
							aria-live='assertive'
						>
							{errorMessage}
						</p>
						<h3 className='title'>Login Account</h3>
						<ul className='social-links'>
							<li>
								<Link to=''>
									<i className='fab fa-google'></i>
								</Link>
							</li>
							<li>
								<Link to=''>
									<i className='fab fa-facebook-f'></i>
								</Link>
							</li>
							<li>
								<Link to=''>
									<i className='fab fa-twitter'></i>
								</Link>
							</li>
						</ul>
						<span className='description'>welcome to our website</span>
						<form className='form-horizontal' onSubmit={handleSubmit}>
							<div className='form-group'>
								<input
									type='email'
									className='form-control auth-input'
									placeholder='Email'
									id='email'
									ref={userRef}
									value={email}
									onChange={handleEmailChange}
									autoComplete='off'
									required
								/>
							</div>
							<div className='form-group'>
								<input
									type='password'
									className='form-control auth-input'
									placeholder='Password'
									id='password'
									onChange={handlePasswordChange}
									value={password}
									required
								/>
							</div>
							<div className='formlink'>
								<Link to={`/signup`} className=''>
									Go to Register
								</Link>
								<Link to={`/forgot-password`} className=''>
									Forgot Password?
								</Link>
							</div>
							<button className='btn' type='submit'>
								{isLoading ? "Signing In..." : "Sign In"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
