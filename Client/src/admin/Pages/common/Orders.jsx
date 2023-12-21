import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { fetchOrders, updateOrderStatus } from '../../../features/auth/AuthSlice';
import { MdDelete } from "react-icons/md";
import { CustomModal } from "../../../containers/common/CustomModal";
// import { deleteOrder } from "../../../features/auth/AuthSlice";
import { showToast } from "../../../containers/common/ShowToast";
import {
	allUserOrders,
	deleteOrder,
	updateOrderStatus,
} from "../../../features/users/userSlice";

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
		title: "Customer Name",
		dataIndex: "customerName",
		sorter: (a, b) =>
			a.customerName.localeCompare(b.customerName) ||
			b.customerName.localeCompare(a.customerName),
	},
	{
		title: "Product",
		dataIndex: "product",
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

const Orders = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [selectedOrder, setSelectedOrder] = useState([]);
	const orderState = useSelector((state) => state?.user?.userOrders);

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			try {
				await dispatch(allUserOrders());
			} catch (error) {
				console.error("Error fetching all orders:", error);
			} finally {
				setIsLoading(false); // Set loading to false regardless of success or failure
			}
		};
		fetchData();
	}, [dispatch]);

	const showModal = (e) => {
		setOpen(true);
		setOrderId(e);
		const orderData = orderState?.find((data) => data._id === e);
		setSelectedOrder(orderData ? orderData?._id : "");
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleDeleteOrder = async (e) => {
		setIsLoading(true);
		try {
			setOpen(false);
			await dispatch(deleteOrder(e));
			await dispatch(allUserOrders());
			showToast("Order has been deleted successfully.");
		} catch (error) {
			console.error("Error deleting inquiry:", error);
		} finally {
			setIsLoading(false); // Set loading to false regardless of success or failure
		}
	};

	const handleUpdateStatus = async (statusData, orderId) => {
		console.log(statusData, orderId);
		setIsLoading(true);
		const data = { id: orderId, delivery_status: statusData };
		try {
			await dispatch(updateOrderStatus(data));
			await dispatch(allUserOrders());
			showToast("delivery status has been updated successfully.");
		} catch (error) {
			console.error("Error occurred while updating delivery status:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const newOrderState = orderState?.slice().sort((a, b) => {
		const dateA = a?.createdAt;
		const dateB = b?.createdAt;
		if (dateA > dateB) {
			return -1;
		}
		if (dateA < dateB) {
			return 1;
		}
		return 0;
	});

	const data1 = [];
	for (let i = 0; i < newOrderState?.length; i++) {
		const createdAtDate = new Date(newOrderState[i]?.createdAt);
		const formattedDate = createdAtDate.toLocaleString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
		data1.push({
			key: i + 1,
			orderId: newOrderState[i]?._id,
			date: formattedDate,
			customerName: newOrderState[i]?.customer_details.name,
			amount: `$ ${(newOrderState[i]?.subTotalAmount).toFixed(2)}`,
			product: (
				<Link
					className='viewColor'
					to={`/admin/view-orders/${newOrderState[i]?.customerId}/${newOrderState[i]?._id}`}
				>
					View Item
				</Link>
			),
			status: (
				<>
					<select
						name=''
						id=''
						defaultValue={
							newOrderState[i]?.delivery_status
								? newOrderState[i]?.delivery_status
								: "Pending"
						}
						className='form-control form-select'
						onChange={(e) =>
							handleUpdateStatus(e.target.value, newOrderState[i]?._id)
						}
					>
						<option value='Pending' className=''>
							Pending
						</option>
						<option value='Delivered' className=''>
							Delivered
						</option>
						<option value='Cancelled' className=''>
							Cancelled
						</option>
					</select>
				</>
			),
			action: (
				<>
					{/* <Link className=''>Edit</Link> */}
					<button
						onClick={() => showModal(newOrderState[i]?._id)}
						className='ms-3 modalFix'
					>
						<MdDelete className='fs-4 text-danger mb-1 ' />
					</button>
				</>
			),
		});
	}
	return (
		<>
			<div>
				<div className='d-flex justify-content-between align-items-center'>
					<h3 className='mb-4 title'>Order Lists</h3>
				</div>
				<div>
					{isLoading ? (
						<div className='loading gap-3'>
							<div className='loading-spinner'></div>
							<div className=''>Loading ... </div>
						</div>
					) : (
						<Table columns={columns} dataSource={data1} />
					)}
				</div>
				<CustomModal
					title='Are you sure you want to delete this order?'
					open={open}
					handleCancel={handleCancel}
					performAction={() => {
						handleDeleteOrder(orderId);
					}}
					selectedOrderId={selectedOrder}
				/>
			</div>
		</>
	);
};

export default Orders;
