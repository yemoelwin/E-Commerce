import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { PiEyeSlashLight } from "react-icons/pi";
import { fetchOrders } from "../features/users/userSlice";

const columns = [
	{
		title: "No",
		dataIndex: "key",
	},
	{
		title: "Order ID",
		dataIndex: "orderId",
	},
	{
		title: "Order Date",
		dataIndex: "date",
		sorter: (a, b) =>
			a.date.localeCompare(b.date) || b.date.localeCompare(a.date),
	},
	{
		title: "Product",
		dataIndex: "product",
	},
	{
		title: "Total Quantity",
		dataIndex: "quantity",
		sorter: (a, b) =>
			a.quantity.toLocaleString(b.quantity) ||
			b.quantity.toLocaleString(a.quantity),
	},
	{
		title: "Total Amount",
		dataIndex: "amount",
		sorter: (a, b) =>
			a.amount.localeCompare(b.amount) || b.amount.localeCompare(a.amount),
	},
	{
		title: "Order Status",
		dataIndex: "status",
	},
	{
		title: "Action",
		dataIndex: "action",
	},
];

const OrderList = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [selectedOrder, setSelectedOrder] = useState([]);
	const orderState = useSelector((state) => state.user.orders);
	const location = useLocation();
	const id = location.pathname.split("/")[2];
	console.log(orderState);

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			try {
				await dispatch(fetchOrders(id));
			} catch (error) {
				console.error("Error fetching all orders:", error);
			} finally {
				setIsLoading(false); // Set loading to false regardless of success or failure
			}
		};
		fetchData();
	}, []);

	const showModal = (e) => {
		setOpen(true);
		setOrderId(e);
		const orderData = orderState?.find((data) => data._id === e);
		setSelectedOrder(orderData ? orderData?._id : "");
	};

	// const handleCancel = () => {
	// 	setOpen(false);
	// };

	// const handleDeleteOrder = async (e) => {
	//     setIsLoading(true);
	//     try {
	//         setOpen(false);
	//         await dispatch(deleteOrder(e));
	//         await dispatch(fetchOrders());
	//         showToast('Order has been deleted successfully.')
	//     } catch (error) {
	//         console.error('Error deleting inquiry:', error);
	//     } finally {
	//         setIsLoading(false); // Set loading to false regardless of success or failure
	//     }
	// }

	const data1 = [];
	for (let i = 0; i < orderState?.length; i++) {
		const userId = orderState[i]?.customerId;
		const transitionId = orderState[i]?.transitionId;
		const date = new Date(orderState[i]?.paidAt);
		const formattedDate = date.toLocaleString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
		data1.push({
			key: i + 1,
			orderId: orderState[i]?._id,
			date: formattedDate,
			quantity: orderState[i]?.totalQuantity,
			amount: `$ ${orderState[i]?.subTotalAmount.toFixed(2)}`,
			product: (
				<Link className='viewColor' to={``}>
					View Item
				</Link>
			),
			status: orderState[i]?.delivery_status,
			action: (
				<>
					<Link
						to={`/checkout-success/${userId}/${transitionId}`}
						className='ms-3'
					>
						<PiEyeSlashLight className='fs-5' />
					</Link>
					<button
						onClick={() => showModal(orderState[i]?._id)}
						className='ms-3 modalFix'
					>
						<MdDelete className='fs-4 text-danger ' />
					</button>
				</>
			),
		});
	}
	return (
		<>
			<div className='container-xl'>
				<h3 className='mb-4 title text-center margin-top'>Order Lists</h3>
				<div className='d-flex justify-content-center align-items-center'></div>
				<div>
					{isLoading ? (
						<div className='loadingX gap-3'>
							<div className='loading-spinner'></div>
							<div className=''>Loading ... </div>
						</div>
					) : (
						<Table columns={columns} dataSource={data1} className='mb-4' />
					)}
				</div>
			</div>
		</>
	);
};

export default OrderList;
