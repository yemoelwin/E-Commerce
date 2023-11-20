import React, { useEffect, useState } from "react";
// import { Document, Page, pdfjs } from 'react-pdf';
// import { LiaLongArrowAltLeftSolid } from 'react-icons/lia';
// import { IoCheckmarkCircle } from 'react-icons/io5';
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCartItem } from "../features/cart/cartSlice";
import { getOrder } from "../features/users/userSlice";
import Invoice from "./Invoice";

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const CheckoutSuccess = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const userId = location.pathname.split("/")[2];
	const transitionId = location.pathname.split("/")[3];
	const orderData = useSelector((state) => state?.user?.orderDetail);
	const paidAtDate = new Date(orderData?.paidAt);
	const formattedDate = `${
		monthNames[paidAtDate.getMonth()]
	}, ${paidAtDate.getDate()}, ${paidAtDate.getFullYear()}, ${paidAtDate.toLocaleTimeString()}`;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		dispatch(clearCartItem());
	}, [dispatch]);

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			try {
				await dispatch(getOrder({ userId, transitionId }));
			} catch (error) {
				console.error("something went wrong", error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [userId, transitionId, dispatch]);

	// const handleClick = async () => {
	//     try {
	//         await dispatch(pdfInvoice(orderData._id))
	//     } catch (error) {
	//         console.error('error occurred while downloading', error);
	//         throw error;
	//     }

	// }

	return (
		<>
			<div className='container'>
				<div className='col-md-12'>
					{isLoading ? ( // Show loading indicator when isLoading is true
						<div className='invoice-loading gap-3'>
							<div className='loading-spinner'></div>
							<div className='load'>Loading ... </div>
						</div>
					) : (
						<div className='invoice' style={{ border: "1px solid #D3D3D3" }}>
							{/* <!-- begin invoice-company --> */}
							<div className='invoice-company text-inverse f-w-600'>
								ShopSphere
								<span className='pull-right hidden-print'>
									<Invoice orderData={orderData} />

									<Link
										to=''
										onClick={() => {}}
										className='btn btn-sm btn-white m-b-10 p-l-5'
									>
										<i className='fa fa-print t-plus-1 fa-fw fa-lg'></i> Print
									</Link>
								</span>
							</div>

							<div className='invoice-header'>
								<div className='invoice-from'>
									<small>from</small>
									<address className='m-t-5 m-b-5'>
										<strong className='text-inverse text-modify'>
											ShopSphere
										</strong>
										<br />
										<span>Mobile: (95) 9257879097</span>
										<br />
										<span>Fax: (046) 456-7890</span>
									</address>
								</div>

								<div className='invoice-to'>
									<small>to</small>
									<address className='m-t-5 m-b-5'>
										<strong className='text-inverse text-modify'>
											{orderData?.customer_details?.name}
										</strong>
										<br />
										<span>Email: {orderData?.customer_details?.email}</span>
										<br />
										<span>
											Address: {orderData?.customer_details?.address?.line1} /
											{orderData?.customer_details?.address?.line2}
										</span>
										<br />
										<span>
											City: {orderData?.customer_details?.address?.city}, Postal
											Code: {orderData?.customer_details?.address?.postal_code}
										</span>
										<br />
										<span>Mobile: {orderData?.customer_details?.phone}</span>
										<br />
									</address>
								</div>

								<div className='invoice-date'>
									<small>Invoice</small>
									<div className='date text-inverse m-t-5'>
										{/* {orderData?.paidAt ? new Date(orderData.paidAt).toLocaleString() : ''}
										 */}
										{orderData?.paidAt ? formattedDate : ""}
									</div>
									<div className='invoice-detail'>
										<span>orderId: {orderData?._id}</span>
										<br />
									</div>
								</div>
							</div>

							<div className='invoice-content'>
								<div className='table-responsive'>
									<table className='table table-invoice'>
										<thead>
											<tr>
												<th>UNIT NAME</th>
												<th className='text-center' width='15%'>
													UNIT AMOUNT
												</th>
												<th className='text-center' width='10%'>
													QUANTITY
												</th>
												<th className='text-right' width='20%'>
													TOTAL AMOUNT
												</th>
											</tr>
										</thead>

										<tbody>
											{orderData?.products?.map((product, index) => (
												<tr key={index}>
													<>
														<td>
															<span
																className='text-inverse'
																title={product?.title}
															>
																{product?.title}
															</span>
															<br />
														</td>
														<td className='text-center'>
															$ {(product?.price).toFixed(2)}
														</td>
														<td className='text-center'>{product?.quantity}</td>
														<td className='text-right'>
															${" "}
															{(product?.quantity * product?.price).toFixed(2)}
														</td>
													</>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								<div className='invoice-price'>
									<div className='invoice-price-left'>
										<div className='invoice-price-row'>
											<div className='sub-price'>
												<small>SUBTOTAL</small>
												<span className='text-inverse'>
													$ {orderData?.subTotalAmount?.toFixed(2)}
												</span>
											</div>

											<div className='sub-price'>
												<i className='fa fa-plus text-muted'></i>
											</div>

											<div className='sub-price'>
												<small>PAYPAL FEE (5.4%) Not Available</small>
												<span className='text-inverse'>$108.00</span>
											</div>
										</div>
									</div>

									<div className='invoice-price-right'>
										<small>TOTAL</small>{" "}
										<span className='f-w-600'>
											$ {orderData?.subTotalAmount?.toFixed(2)}
										</span>
									</div>
								</div>
							</div>

							<div className='invoice-note'>
								<p>
									* Make all cheques payable to [ <span> shopsphere </span> ]{" "}
								</p>
								<p>* Payment is due within 30 days </p>
								<p className='d-flex'>
									* If you have any questions concerning this invoice, contact
									to [<li>yemoelwin,</li>
									<li>
										<Link to={`tel:+959257879097`}>+959257879097</Link>,
									</li>
									<li>
										<Link to={`mailto:yemoelwin@gmail.com`}>
											yemoelwin142@gmail.com
										</Link>
									</li>
									]
								</p>
							</div>

							<div className='invoice-footer'>
								<p className='text-center m-b-5 f-w-600'>
									THANK YOU FOR YOUR PURCHASING
								</p>
								<p className='text-center'>
									<span className='m-r-10'>
										<i className='fa fa-fw fa-lg fa-globe'></i> shopsphere.com
									</span>
									<span className='m-r-10'>
										<i className='fa fa-fw fa-lg fa-phone-volume'></i>{" "}
										Tel:95-9257879097
									</span>
									<span className='m-r-10'>
										<i className='fa fa-fw fa-lg fa-envelope'></i>{" "}
										shopsphereone609@gmail.com
									</span>
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default CheckoutSuccess;

// {/* <div className='checkout_success'>
//                 <div>
//                     <div className="alertX alert-success alert" role="alert">
//                         <IoCheckmarkCircle className='fs-5'/>
//                         <h5>Success! Your order has been successfully placed.</h5>
//                     </div>

//                     <div className='link_x'>

//                         <button type="button" className="btn btn-outline-primary" >
//                             <Link to={`/`} ><LiaLongArrowAltLeftSolid className='arrow' />Go to shopping </Link>
//                         </button>

//                         <button type="button" className="btn btn-outline-primary">download order invoice </button>
//                     </div>
//                 </div>
//             // </div> */}
