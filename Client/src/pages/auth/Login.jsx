import React,{ useRef,useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Meta from '../../components/common/Meta';
import BreadCrumb from '../../components/common/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/AuthSlice'
// import { setCredentials } from '../../features/auth/test/authSlices'
// import { useLoginMutation } from '../../features/auth/test/AuthApiSlice'

const Login = () => {
    const userRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading, user } = useSelector((state) => state.auth);

    useEffect(() => {
        userRef.current.focus()
    }, [])

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const loginData = { email, password };
            dispatch(login(loginData));
            // localStorage.setItem('user', JSON.stringify(userData));
            
            navigate('/admin')
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    // useEffect(() => {
    //     if (user && user.role) {
    //     if (user.role === 'admin') {
    //         navigate('/admin');
    //     } else if (user.role === 'user') {
    //         navigate('/'); // Change this to the actual route for the home page.
    //     }
    //     }
    // }, [user, navigate]);

    return (
        <>
                <Meta title={'Login'} />
                <BreadCrumb title='Login' />
                <div className="form-bg">
                    <div className="container d-flex justify-content-center">
                        <div className="form-container">
                            {/* <p className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>
                                {errMsg}
                            </p> */}
                            <h3 className="title">Login Account</h3>
                            <ul className="social-links">
                                <li><Link to=""><i className="fab fa-google"></i></Link></li>
                                <li><Link to=""><i className="fab fa-facebook-f"></i></Link></li>
                                <li><Link to=""><i className="fab fa-twitter"></i></Link></li>
                            </ul>
                            <span className="description">welcome to our website</span>
                            <form className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-control auth-input"
                                        placeholder="Email"
                                        id='email'
                                        ref={userRef}
                                        value={email}
                                        onChange={handleEmailChange}
                                        autoComplete='off'
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control auth-input"
                                        placeholder="Password"
                                        id='password'
                                        onChange={handlePasswordChange}
                                        value={password}
                                        required
                                    />
                                </div>
                                <button className="btn" type='submit'>{isLoading ? 'Signing In...' : 'Sign In'}</button>
                            </form>
                        </div>
                    </div>
                </div>
        </>
    )
}


export default Login;


