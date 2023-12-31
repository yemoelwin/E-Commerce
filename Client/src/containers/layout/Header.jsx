import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import compare from "../../images/compare.svg";
import wishlist from "../../images/wishlist.svg";
import user from "../../images/profile.avif";
import image from "../../images/main-banner-1.jpg";
import cart from "../../images/cart.svg";
import { FaLuggageCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";

import { logout } from "../../features/auth/AuthSlice";
import { persistor } from "../../app/store";
import { clearCartItem } from "../../features/cart/cartSlice";
import { searchInputProducts } from "../../features/products/productSlice";
import { showToast } from "../common/ShowToast";

const Header = () => {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const menuRef = useRef();

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const [searchInput, setSearchInput] = useState("");

	const authState = useSelector((state) => state.auth.users);

	const { totalQuantity, cartTotalAmount } = useSelector((state) => state.cart);

	useEffect(() => {
		function handleDocumentClick(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				// Click occurred outside the menu, so close it
				setIsMenuOpen(false);
			}
		}
		if (isMenuOpen) {
			// Add the click event listener when the menu is open
			document.addEventListener("click", handleDocumentClick);
		}
		return () => {
			// Remove the click event listener when the component unmounts
			document.removeEventListener("click", handleDocumentClick);
		};
	}, [isMenuOpen]);

	const toggleMenu = (event) => {
		event.stopPropagation();
		setIsMenuOpen(!isMenuOpen);
	};

	const handleSearchProduct = async () => {
		try {
			if (
				searchInput === "" ||
				searchInput === undefined ||
				searchInput === null
			) {
				setSearchInput("");
				setTimeout(() => {
					showToast("Pls enter name, brand or category for the output", "info");
				}, 300);
			} else {
				await dispatch(searchInputProducts(searchInput));
				// navigate(`/product`);
				navigate(`/product?search=${encodeURIComponent(searchInput)}`);
			}
		} catch (error) {
			console.error("Error searching for products:", error);
		}
	};

	const handleLogout = async () => {
		try {
			await dispatch(logout());
			dispatch(clearCartItem());
			/* clear all data in the localStorage */
			localStorage.clear();

			// clear all data which are persisted by redux persist library
			persistor.purge();
			navigate("/login");

			// Reload the page
			// window.location.reload();
		} catch (error) {
			console.error("something went wrong", error);
		}
	};

	return (
		<>
			<header className='header-top-strip py-3'>
				<div className='container-xxl'>
					<div className='row'>
						<div className='col-6'>
							<p className='text-white mb-0'>
								Free Shipping Over $100 & Free Returns
							</p>
						</div>
						<div className='col-6'>
							<p className='text-end text-white mb-0'>
								Hotline:{" "}
								<a className='text-white' href='tel:+95 9257879097'>
									+95 9257879097
								</a>
							</p>
						</div>
					</div>
				</div>
			</header>

			<header className='header-upper py-3'>
				<div className='container-xxl'>
					<div className='row align-items-center'>
						{authState && authState?.role === "admin" ? (
							<div className='col-2 dashboardBanner'>
								<Link to='admin' className='dashboard-link'>
									<RxDashboard />
									<span>DashBoard</span>
								</Link>
							</div>
						) : (
							<div className='col-2'>
								<h2>
									<Link to='/' className='navBanner'>
										ShopSphere
									</Link>
								</h2>
							</div>
						)}

						<div className='col-5'>
							<div className='input-group'>
								<input
									type='text'
									className='form-control'
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSearchProduct();
										}
									}}
									placeholder='Search for by name, brand & category...'
								/>
								<span
									className='input-group-text p-3'
									id='basic-addon2'
									style={{ cursor: "pointer" }}
								>
									<BsSearch onClick={handleSearchProduct} className='fs-6' />
								</span>
							</div>
						</div>

						<div className='col-5'>
							<div className='header-upper-links d-flex align-items-center justify-content-between'>
								<div>
									<NavLink
										to='/compare-product'
										className={({ isActive }) =>
											isActive
												? "link-active active-display"
												: "inactive-display"
										}
									>
										<img src={compare} alt='compare'></img>
										<p className='mb-0'>
											Compare <br />
											Products
										</p>
									</NavLink>
								</div>

								<div>
									<NavLink
										to='/wishlist'
										className={({ isActive }) =>
											isActive
												? "link-active active-display"
												: "inactive-display"
										}
									>
										<img src={wishlist} alt='wishlist'></img>
										<p className='mb-0'>
											Favourite <br />
											wishlist
										</p>
									</NavLink>
								</div>

								<div>
									<NavLink
										to='/cart'
										className={({ isActive }) =>
											isActive
												? "link-active active-display"
												: "inactive-display"
										}
									>
										<img src={cart} alt='cart'></img>
										<div className='d-flex flex-column gap-10'>
											<span className='badge bg-white text-dark'>
												{totalQuantity ? totalQuantity : 0}
											</span>
											<p className='mb-0'>
												$ {(cartTotalAmount ? cartTotalAmount : 0).toFixed(2)}
											</p>
										</div>
									</NavLink>
								</div>

								{authState && authState.status === "Success" ? (
									<div className='hero'>
										<div className='profile-logo'>
											<img
												src={user}
												className='wrap-logo'
												alt=''
												onClick={toggleMenu}
											/>
										</div>

										<div
											className={`sub-menu-wrap ${
												isMenuOpen ? "open-menu" : ""
											}`}
											ref={menuRef}
										>
											<div className='sub-menu'>
												<div className='user-info'>
													<img src={image} className='user-logo' alt='' />
													<h5>{`${authState?.firstname} ${authState?.lastname}`}</h5>
												</div>
												<hr />

												<div>
													<>
														<div>
															<Link to={""} className='sub-menu-link'>
																<CgProfile className='logo-sl' />
																<p>Edit Profile</p>
															</Link>
														</div>

														<div>
															<Link
																to={`/orderlists/${authState?._id}`}
																className='sub-menu-link'
															>
																<FaLuggageCart className='logo-sl' />
																<p>Order lists</p>
															</Link>
														</div>

														<div className='logout-menu-link'>
															<button
																onClick={handleLogout}
																className='logout-submenu-link'
															>
																<IoIosLogOut className='logo-sl' />
																<p>Logout</p>
															</button>
														</div>
													</>
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className='profile-login'>
										<Link
											to='/login'
											className='d-flex align-items-center gap-10 text-white'
										>
											<img src={user} alt='user'></img>
											<p className='mb-0'>
												Login <br /> Account
											</p>
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>

			<header className='header-bottom py-3'>
				<div className='container-xxl'>
					<div className='row'>
						<div className='col-12'>
							<div className='menu-bottom d-flex justify-content-center align-items-center gap-40'>
								{/* <div>
									<div className='dropdown'>
										<button
											className='btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center'
											type='button'
											id='dropdownMenuButton1'
											data-bs-toggle='dropdown'
											aria-expanded='false'
										>
											<img src='images/menu.svg' alt='' />
											<span className='me-5 d-inline-block'>
												Shop Categories
											</span>
										</button>
										<ul
											className='dropdown-menu'
											aria-labelledby='dropdownMenuButton1'
										>
											<Link className='dropdown-item text-white' to=''>
												Action
											</Link>
											<Link className='dropdown-item text-white' to=''>
												Another Action
											</Link>
											<Link className='dropdown-item text-white' to=''>
												Something else here
											</Link>
										</ul>
									</div>
								</div> */}

								<div className='menu-links'>
									<div className='d-flex align-items-center gap-15'>
										<NavLink to='/'>Home</NavLink>
										<NavLink to='/product'>Our Store</NavLink>
										<NavLink to='/blog'>Blogs</NavLink>
										<NavLink to='/contact'>Contact</NavLink>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
