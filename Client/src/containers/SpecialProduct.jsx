import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const SpecialProduct = (props) => {
	const { specialData } = props;

	return (
		<div className='grid-container'>
			{specialData &&
				specialData?.map((item, index) => {
					if (item?.tags === "special") {
						return (
							<div className='special-product-card mb-3' key={index}>
								<div className='d-flex justify-content-between'>
									<div>
										<img
											src={item?.images[0].url}
											className='img-fluid'
											alt='special'
										/>
									</div>

									<div className='special-product-content'>
										<h5 className='brand'>{item?.brand}</h5>
										<h6 className='title' title={item?.title}>
											{item?.title?.length > 15
												? (() => {
														const truncatedTitle = item?.title.substr(0, 20);
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
												: item?.title}
										</h6>
										<ReactStars
											count={5}
											size={24}
											value={parseFloat(item?.totalrating)}
											edit={false}
											activeColor='#ffd700'
										/>
										<p className='price'>
											{/* <span className='red-p'>${item?.price}</span> &nbsp;{" "}
											<strike>$250</strike> */}
											<span className='red-p'>${item?.price}</span> &nbsp;{" "}
											<strike>${250}</strike>
										</p>

										<div className='discount-till d-flex align-items-center gap-10'>
											<p className=' mb-0'>
												<b>5</b>days
											</p>
											<div className='d-flex gap-10 align-items-center'>
												<span className='badge rounded-circle p-3 bg-danger'>
													1
												</span>
												:
												<span className='badge rounded-circle p-3 bg-danger'>
													1
												</span>
												:
												<span className='badge rounded-circle p-3 bg-danger'>
													1
												</span>
											</div>
										</div>

										<div className='prod-count my-3'>
											<p>Products: {item?.quantity}</p>
											<div className='progress'>
												<div
													className='progress-bar'
													role='progressbar'
													style={{
														width:
															item?.quantity / item?.quantity +
															item?.sold * 100 +
															"%",
													}}
													aria-valuenow={
														item?.quantity / item?.quantity + item?.sold * 100
													}
													aria-valuemin={item?.quantity}
													aria-valuemax={item?.sold + item?.quantity}
												></div>
											</div>
										</div>
										<Link className='button' to={`/product/${item?._id}`}>
											View Product
										</Link>
									</div>
								</div>
							</div>
						);
					}
					return null; // Add this line
				})}
		</div>
	);
};

export default SpecialProduct;
