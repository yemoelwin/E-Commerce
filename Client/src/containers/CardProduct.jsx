import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";
import wish from "../images/wish.svg";
import redWish from "../images/wishRed.svg";
// import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import { useDispatch, useSelector } from "react-redux";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { addToWishlist } from "../features/wishlist/wishlistSlice";

const CardProduct = (props) => {
	const { grid, prodData } = props;

	let location = useLocation();

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

	const wishlistData = useSelector(
		(state) => state.wishlist?.wishlist?.user?.wishlist,
	);

	const isProductInWishlist = (prodId) => {
		return wishlistData?.some((item) => item.productId === prodId);
	};

	const handleWishlist = async (prodId) => {
		try {
			console.log(prodId);

			// Dispatch the action to add/remove from the wishlist
			await dispatch(addToWishlist(prodId));
		} catch (error) {
			console.error("error", error);
			throw new Error("Something went wrong while adding item to wishlist");
		}
	};

	return (
		<>
			{prodData &&
				prodData?.map((item, index) => {
					return (
						<div
							className={`${
								location.pathname === "/product" ? `gr-${grid}` : "col-3"
							}`}
							key={index}
						>
							<div className='product-card position-relative'>
								<div className='product-image'>
									{item?.images && item?.images?.length > 0 && (
										<LazyLoadImage
											src={item.images[0].url}
											alt='product'
											className='img-fluid mx-auto '
											effect='blur'
										/>
									)}
								</div>

								<div className='product-details'>
									<h6 className='brand'>{item.brand}</h6>
									<h5 className='product-title' title={item?.title}>
										{item?.title.length > 15
											? (() => {
													const truncatedTitle = item?.title.substr(0, 50);
													const lastSpaceIndex =
														truncatedTitle.lastIndexOf(" ");
													if (lastSpaceIndex !== -1) {
														return `${truncatedTitle.substr(
															0,
															lastSpaceIndex,
														)}...`;
													} else {
														return `${truncatedTitle}...`;
													}
											  })()
											: item?.title}
									</h5>
									<ReactStars
										count={5}
										size={24}
										value={parseFloat(item.totalrating)}
										edit={false}
										activeColor='#ffd700'
									/>
									<p
										className={`description ${
											grid === 12 ? "d-block" : "d-none"
										}`}
										description={item.description}
									>
										{item?.description.length > 15
											? (() => {
													const truncatedDescription = item?.description.substr(
														0,
														300,
													);
													const lastSpaceIndex =
														truncatedDescription.lastIndexOf(" ");
													if (lastSpaceIndex !== -1) {
														return `${truncatedDescription.substr(
															0,
															lastSpaceIndex,
														)}...`;
													} else {
														return `${truncatedDescription}...`;
													}
											  })()
											: item?.description}
									</p>
									<p className='price'>{`$ ${item?.price.toFixed(2)}`}</p>
								</div>

								<div className='action-bar position-absolute'>
									<div className='d-flex flex-column'>
										{isAuthenticated && (
											<button
												className='mb-1 border-0 bg-transparent'
												onClick={(e) => {
													handleWishlist(item?._id);
												}}
											>
												{isProductInWishlist(item._id) ? (
													<img src={redWish} alt='added wishlist' />
												) : (
													<img src={wish} alt='empty wishlist' />
												)}
											</button>
										)}

										<button
											onClick={() => navigate(`/product/${item?._id}`)}
											className='mb-1 border-0 bg-transparent'
										>
											<img src={view} alt='addcart' />
										</button>
									</div>
								</div>
							</div>
						</div>
					);
				})}
		</>
	);
};

export default CardProduct;
