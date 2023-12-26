import React, { useEffect, useState } from "react";
import Meta from "../containers/common/Meta";
import BreadCrumb from "../containers/common/BreadCrumb";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactImageZoom from "react-image-zoom";
import Colors from "../containers/Colors";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import Container from "../containers/common/Container";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData, rating } from "../features/products/productSlice";
import { showToast } from "../containers/common/ShowToast";
import copy from "copy-to-clipboard";
import { addToCart } from "../features/cart/cartSlice";
import { RxCross1 } from "react-icons/rx";
import IsLoading from "../containers/common/IsLoading";
import Loading from "../containers/common/Loading";

const SingleProduct = () => {
	// window.scrollTo(0, 0);

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const location = useLocation();

	const [color, setColor] = useState(null);

	const [alreadyAdded, setAlreadyAdded] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	const [stars, setStars] = useState(0);

	const [comment, setComment] = useState("");

	const prodId = location.pathname.split("/")[2];

	const product = useSelector((state) => state?.product?.singleData);

	const cartState = useSelector((state) => state?.cart?.items);

	const userReviews = product?.ratings;

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setIsLoading(true);
				await dispatch(fetchProductData(prodId));
			} catch (error) {
				console.error("error", error);
				showToast("Something went wrong!");
			} finally {
				setIsLoading(false);
			}
		};
		fetchProduct();
	}, [prodId]);

	useEffect(() => {
		const isProductInCart = async () => {
			for (let index = 0; index < cartState.length; index++) {
				if (prodId === cartState[index]?.productId) {
					setAlreadyAdded(true);
				}
			}
		};
		isProductInCart();
	}, [prodId, cartState]);

	const rateToProduct = async () => {
		try {
			if (stars === 0) {
				showToast("Please add star rating", "info");
			} else if (comment.trim() === "") {
				showToast("Please write comment about the product", "info");
			} else {
				setIsLoading(true);
				await dispatch(
					rating({
						stars: stars,
						comment: comment,
						prodId: prodId,
					}),
				);
				setTimeout(() => {
					showToast("Rating submitted successfully", "success");
					setStars(0);
					setComment("");
				}, 200);
			}
		} catch (error) {
			console.error("An error occurred while rating the product:", error);
			showToast("An error occurred while rating the product", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const props = {
		width: 600,
		height: 400,
		zoomWidth: 500,
		img: product?.images[0].url ? product?.images[0].url : "",
	};

	// const closeModal = () => {
	//     setIsModalOpen(false);
	// };

	const handleConfirm = async () => {
		if (!color || color === "") {
			showToast("Please choose the color", "error");
		} else {
			const cartItem = {
				productId: product._id,
				title: product.title,
				image: product.images[0].url,
				color,
				price: product.price,
				brand: product.brand,
			};
			await dispatch(addToCart(cartItem));
		}
	};

	const handleAddToCart = () => {};

	const scrollToReview = () => {
		const reviewElement = document.getElementById("review");
		if (reviewElement) {
			reviewElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<>
			<Meta title={"Product Name"} />
			<BreadCrumb title='Product Name' />

			<Container class1='main-product-wrapper py-5 home-wrapper-2'>
				<div className='row'>
					<div className='col-6'>
						{/* Main Image */}

						<div className='main-product-image d-flex justify-content-center'>
							{isLoading ? (
								<div
									className='d-flex justify-content-center'
									style={{ height: "400px", width: "100%" }}
								>
									<Loading />
								</div>
							) : (
								<div>
									<ReactImageZoom {...props} />
								</div>
							)}
						</div>

						{/* Sub Images */}
						<div className='other-product-images d-flex flex-wrap justify-content-between gap-15'>
							{isLoading ? ( // Show loading indicator when isLoading is true
								<Loading />
							) : (
								<div>
									<img
										src={product?.images[0].url}
										className='img-fluid'
										alt=''
									/>
								</div>
							)}

							{isLoading ? (
								<Loading />
							) : (
								<div>
									<img
										src={product?.images[0].url}
										className='img-fluid'
										alt=''
									/>
								</div>
							)}

							{isLoading ? (
								<Loading />
							) : (
								<div>
									<img
										src={product?.images[0].url}
										className='img-fluid'
										alt=''
									/>
								</div>
							)}

							{isLoading ? (
								<Loading />
							) : (
								<div>
									<img
										src={product?.images[0].url}
										className='img-fluid'
										alt=''
									/>
								</div>
							)}
						</div>
					</div>

					<div className='col-6'>
						<div className='main-product-details'>
							{/* Title */}
							<div className='border-bottom'>
								<h3 className='title'>{product?.title}</h3>
							</div>

							{/* Price & Write Review & TotalRating */}
							<div className='border-bottom py-3'>
								<p className='price'>$ {product?.price}</p>
								<div className='d-flex align-items-center gap-10'>
									<ReactStars
										count={5}
										size={24}
										value={parseFloat(product?.totalrating) || 0}
										edit={false}
										activeColor='#ffd700'
									/>
									<p className='mb-0 t-review'>
										( {userReviews?.length} Reviews )
									</p>
								</div>
								<Link className='review-btn' to='#' onClick={scrollToReview}>
									Write a Review
								</Link>
							</div>

							{isLoading ? (
								<IsLoading />
							) : (
								<div className=' py-3'>
									{/* Type */}
									<div className='d-flex gap-10 align-items-center my-2'>
										<h3 className='product-heading'>Type :</h3>
										<p className='product-data'>{product?.category}</p>
									</div>

									{/* Brand */}
									<div className='d-flex gap-10 align-items-center my-2'>
										<h3 className='product-heading'>Brand :</h3>
										<p className='product-data'>{product?.brand}</p>
									</div>

									{/* Category */}
									<div className='d-flex gap-10 align-items-center my-2'>
										<h3 className='product-heading'>Category :</h3>
										<p className='product-data'>{product?.category}</p>
									</div>

									{/* Tags */}
									<div className='d-flex gap-10 align-items-center my-2'>
										<h3 className='product-heading'>Tags :</h3>
										<p className='product-data'>{product?.tags}</p>
									</div>

									{product ? (
										<div className='d-flex gap-10 align-items-center my-2'>
											<h3 className='product-heading'>Availability :</h3>
											<p className='product-data'>
												<span>
													{product.quantity > 0
														? `in stock (${product.quantity})`
														: "out of stock"}
												</span>
											</p>
										</div>
									) : (
										// Render a loading indicator or error message
										<p>Loading product data...</p>
									)}

									{/* Size */}
									<div className='d-flex gap-10 flex-column mt-2 mb-3'>
										<h3 className='product-heading'>Size :</h3>
										<div className='d-flex flex-wrap gap-15'>
											<span className='badge border border-1 bg-white text-dark border-secondary'>
												S
											</span>
											<span className='badge border border-1 bg-white text-dark border-secondary'>
												M
											</span>
											<span className='badge border border-1 bg-white text-dark border-secondary'>
												XL
											</span>
											<span className='badge border border-1 bg-white text-dark border-secondary'>
												XXL
											</span>
										</div>
									</div>

									{/* Color */}
									<div className='mt-2 mb-3'>
										{alreadyAdded === false && (
											<>
												<div className='d-flex gap-10'>
													<h3 className='product-heading'>
														Available Color :{" "}
													</h3>
													<Colors setColor={setColor} colorData={product} />
												</div>
												<div>
													<h3
														className='product-heading'
														style={{ color: "#000080", fontWeight: "600" }}
													>
														Selected Color: {color ? color : ""}
													</h3>
												</div>
											</>
										)}
									</div>

									{/* Add to Cart */}
									<div>
										{product && product.quantity > 0 ? (
											<div className={alreadyAdded ? "ms-0" : "mt-3"}>
												{alreadyAdded ? (
													<p className='font-sizeX'>This item already added.</p>
												) : (
													<button
														className='buttonX'
														data-bs-toggle='modal'
														data-bs-target='#staticBackdrop'
														type='button'
														onClick={() => handleAddToCart()}
													>
														Add to Cart
													</button>
												)}
											</div>
										) : (
											<p className='fs-6 ' style={{ color: "red" }}>
												Currently not available
											</p>
										)}

										<div
											className='modal fade'
											id='staticBackdrop'
											data-bs-backdrop='static'
											data-bs-keyboard='false'
											tabIndex='-1'
											aria-labelledby='staticBackdropLabel'
											aria-hidden='true'
										>
											<div className='modal-dialog'>
												<div className='modal-content'>
													<div className='modal-header'>
														<h5
															className='modal-title'
															id='staticBackdropLabel'
														>
															Are you sure to add this item?
														</h5>
														<RxCross1
															type='button'
															// className="btn-close"
															data-bs-dismiss='modal'
															aria-label='Close'
														></RxCross1>
													</div>

													<div className='modal-body'>
														<div className='d-flex align-items-center'>
															<div className='flex-grow-1 w-50 modal-img'>
																<img
																	src={product?.images[0]?.url}
																	className='img-fluid'
																	alt='product images'
																/>
															</div>

															<div className='d-flex flex-column flex-grow-1 w-50 align-items-center p-3'>
																<div>
																	<h6 className='mb-3' title={product?.title}>
																		{product?.title?.length > 15
																			? (() => {
																					const truncatedTitle =
																						product?.title.substr(0, 70);
																					const lastSpaceIndex =
																						truncatedTitle.lastIndexOf(" ");
																					if (!lastSpaceIndex) {
																						return `${truncatedTitle}...`;
																					}
																					return `${truncatedTitle.substr(
																						0,
																						lastSpaceIndex,
																					)}...`;
																			  })()
																			: product?.title}
																	</h6>

																	<p className='mb-1 modal-font-size'>
																		price: ${product?.price}
																	</p>
																	<p className='mb-1 modal-font-size'>
																		color: {color}
																	</p>
																	<p className='mb-1 modal-font-size'>
																		Size: abcd
																	</p>
																</div>
															</div>
														</div>
													</div>

													<div className='modal-footer border-0 gap-10'>
														<button
															type='submit'
															className='btn btn-primary'
															data-bs-dismiss='modal'
															onClick={() => {
																navigate(`/cart`);
															}}
														>
															View Cart
														</button>
														<button
															type='submit'
															className='btn btn-primary'
															data-bs-dismiss='modal'
															onClick={() => {
																handleConfirm();
															}}
														>
															Confirm
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Add to Compare & Add to Wishlist*/}
									<div className='d-flex align-items-center gap-15 mt-4'>
										<div className='compareandwishlist'>
											<Link to=''>
												<TbGitCompare className='fs-5 me-2' /> Add to Compare
											</Link>
										</div>
										<div className='compareandwishlist'>
											<Link to=''>
												<AiOutlineHeart className='fs-5 me-2' /> Add to Wishlist
											</Link>
										</div>
									</div>

									{/* Shipping & Returns */}
									<div className='d-flex gap-10 flex-column my-3 mt-4'>
										<h3 className='product-heading'>
											<b>Shipping & Returns :</b>
										</h3>
										<p className='product-data fs-7'>
											Free shipping and returns available on all orders! <br />{" "}
											We ship all US domestic orders within
											<b>5-10 business days!</b>
										</p>
									</div>

									{/* Copy ClipBoard */}
									<div className='d-flex gap-10 align-items-center my-3'>
										<h3 className='product-heading'>
											<b>Product Link:</b>
										</h3>
										<Link
											to=''
											onClick={() => {
												copy(window.location.href);
												showToast(
													"Product link copied to clipboard",
													"success",
												);
											}}
										>
											Copy Product Link
										</Link>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</Container>

			{/* Description */}
			<Container class1='description-wrapper home-wrapper-2'>
				<div className='row'>
					<div className='col-12'>
						<h4>Description</h4>
						<div className='bg-white p-3 description-inner-wrapper'>
							<p>{product?.description}</p>
						</div>
					</div>
				</div>
			</Container>

			{/* Customer Reviews */}
			<Container class1='reviews-wrapper py-5 home-wrapper-2'>
				<div className='row'>
					<div className='col-12'>
						<h3 id='review'>Reviews</h3>
						<div className='review-inner-wrapper'>
							{/* Write comments and star rating */}
							<div id='review' className='review-form py-4'>
								<h4>Write a Review</h4>

								<div>
									<ReactStars
										count={5}
										size={24}
										value={stars}
										edit={true}
										onChange={(newRating) => setStars(newRating)}
										activeColor='#ffd700'
									/>
								</div>
								<div>
									<textarea
										name=''
										id=''
										className='w-100 form-control'
										cols='30'
										rows='4'
										value={comment}
										placeholder='Comments'
										onChange={(e) => setComment(e.target.value)}
									></textarea>
								</div>
								<div className='d-flex justify-content-end mt-3'>
									<button
										onClick={rateToProduct}
										className='button border-0'
										type='button'
									>
										Submit Review
									</button>
								</div>
							</div>

							{/* Display each user reviews */}
							<div className='reviews mt-4'>
								<p
									className='mb-2'
									style={{
										fontSize: "16px",
										fontWeight: "600",
										textDecoration: "underline",
									}}
								>
									Customer Reviews
								</p>
								{isLoading ? (
									<IsLoading />
								) : (
									<div className='user-review'>
										{userReviews && userReviews.length > 0 ? (
											userReviews.map((review, index) => {
												return (
													<div className='review' key={index}>
														<div className='d-flex gap-10 align-items-center'>
															<p
																className='mb-0'
																style={{
																	fontSize: "14px",
																	fontWeight: "600",
																	color: "#0E86D4",
																	textDecoration: "underline",
																	marginTop: "3px",
																}}
															>
																{review.postedby.firstname}
																{review.postedby.lastname}
															</p>
															(
															<ReactStars
																count={5}
																size={24}
																value={review?.stars}
																edit={false}
																activeColor='#ffd700'
															/>
															)
														</div>
														<p className='mt-3'>{review?.comment}</p>
													</div>
												);
											})
										) : (
											<p className='no-review'>No Review</p>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};

export default SingleProduct;
