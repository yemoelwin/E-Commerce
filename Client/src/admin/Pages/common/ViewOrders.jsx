import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { getOrder } from "../../../features/users/userSlice";

const columns = [
	{
		title: "No",
		dataIndex: "key",
	},
	{
		title: "Product ID",
		dataIndex: "productId",
	},
	{
		title: "Product Name",
		dataIndex: "productName",
	},
	{
		title: "Brand",
		dataIndex: "brand",
	},
	{
		title: "Color",
		dataIndex: "color",
	},
	{
		title: "Price",
		dataIndex: "price",
	},
	{
		title: "Quantity",
		dataIndex: "quantity",
	},
];

const ViewOrders = () => {
	const dispatch = useDispatch();
	// const location = useLocation();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const { userId, transitionId } = useParams();
	console.log("orderId", userId, transitionId);
	const orderProductState = useSelector((state) => state?.user?.orderDetail);

	console.log(orderProductState);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (userId && transitionId !== undefined) {
					setIsLoading(true);
					await dispatch(getOrder({ userId, transitionId }));
				}
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [userId, transitionId, dispatch]);

	const goBack = () => {
		navigate(-1);
	};

	const data1 = [];
	for (let i = 0; i < orderProductState?.products.length; i++) {
		const title = orderProductState?.products[i]?.title;
		let productName;
		if (title?.length > 15) {
			const truncatedTitle = title.substr(0, 50);
			const lastSpaceIndex = truncatedTitle.lastIndexOf(" ");
			if (lastSpaceIndex !== -1) {
				productName = `${truncatedTitle.substr(0, lastSpaceIndex)}...`;
			} else {
				productName = `${truncatedTitle}...`;
			}
		} else {
			productName = title;
		}
		data1.push({
			key: i + 1,
			productId: orderProductState?.products[i]?.productId,
			productName: (
				<>
					<span title={title}>{productName}</span>
				</>
			),
			brand: orderProductState?.products[i]?.brand,
			color: orderProductState?.products[i]?.color,
			price: `$ ${(orderProductState?.products[i]?.price).toFixed(2)}`,
			quantity: orderProductState?.products[i]?.quantity,
			action: (
				<>
					<Link className=''>Edit</Link>
					<Link className='ms-3'>
						<MdDelete className='fs-5 text-danger mb-1 ' />
					</Link>
				</>
			),
		});
	}
	return (
		<>
			<div>
				<div className='d-flex justify-content-between align-items-center'>
					<h3 className='mb-4 title'>View Order</h3>
					<button
						onClick={goBack}
						className='bg-transparent border-0 fs-6 align-items-center d-flex gap-1 gobackColor'
					>
						<BiArrowBack className='fs-5 mt-1 gobackColor' />
						Go Back
					</button>
				</div>
				<div>
					{isLoading ? (
						<div className='loading gap-3'>
							<div className='loading-spinner'></div>
							<div className=''>Loading... </div>
						</div>
					) : (
						<Table columns={columns} dataSource={data1} />
					)}
				</div>
			</div>
		</>
	);
};

export default ViewOrders;
