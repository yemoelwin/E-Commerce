import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders, updateOrderStatus } from '../../../features/auth/AuthSlice';
import { MdDelete } from 'react-icons/md';
import { CustomModal } from '../../../containers/common/CustomModal';
import { deleteOrder } from '../../../features/auth/AuthSlice';
import { showToast } from '../../../containers/common/ShowToast';

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
        sorter: (a, b) => a.date.localeCompare(b.date) || b.date.localeCompare(a.date),
    },
    {
        title: "Customer Name",
        dataIndex: "customerName",
        sorter: (a, b) => a.customerName.localeCompare(b.customerName) || b.customerName.localeCompare(a.customerName),
    },
    {
        title: "Product",
        dataIndex: "product",
    },
    {
        title: "Total Amount",
        dataIndex: "amount",
        sorter: (a, b) => a.amount.localeCompare(b.amount) || b.amount.localeCompare(a.amount),
    },
    {
        title: "Order Status",
        dataIndex: 'status',
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
    const [orderId, setOrderId] = useState('');
    const [selectedOrder, setSelectedOrder] = useState([]);
    const orderState = useSelector((state) => state.auth.orders);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async() => {
            try {
                await dispatch(fetchOrders());
            } catch (error) {
                console.error('Error fetching all orders:', error);
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
        }
        fetchData();
    }, []);

    const showModal = (e) => {
        setOpen(true);
        setOrderId(e);
        const orderData = orderState?.find((data) => data._id === (e));
        setSelectedOrder(orderData ? orderData?._id : '');
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleDeleteOrder = async (e) => {
        setIsLoading(true);
        try {
            setOpen(false);
            await dispatch(deleteOrder(e));
            await dispatch(fetchOrders()); 
            showToast('Order has been deleted successfully.')
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or failure
        }
    }
        
    // const handleUpdateStatus = async(statusData, orderId) => {
    //     console.log(statusData, orderId);
    //     setIsLoading(true);
    //     const data = { id: orderId, data: statusData };
    //     try {
    //         await dispatch(updateOrderStatus(data));
    //         await dispatch(fetchOrders());
    //         showToast('Order status has been changed successfully.');
    //     } catch (error) {
    //         console.error('Error occurred while updating order status:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
    
    const data1 = [];
    for (let i = 0; i < orderState?.length; i++) {

        const createdAtDate = new Date(orderState[i]?.createdAt);
        const formattedDate = createdAtDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        data1.push({
            key: i + 1,
            orderId: orderState[i]?._id,
            date: formattedDate,
            customerName: orderState[i]?.orderby[0].firstname + ' ' + orderState[i]?.orderby[0].lastname,
            amount: `$ ${orderState[i]?.payment[0]?.amount}`,
            product: <Link className='viewColor' to={`/admin/view-orders/${orderState[i]?._id}`}>View Item</Link>,
            status: (
                <>
                    <select
                        name="" id=''
                        // defaultValue={orderState[i]?.orderStatus ? orderState[i]?.orderStatus : 'Not Processed'}
                        className='form-control form-select'
                        // onChange={(e) => handleUpdateStatus(e.target.value, orderState[i]?._id)}
                    >
                        <option value="Not Processed" className=''>Not Processed</option>
                        <option value="Processing" className=''>Processing</option>
                        <option value="Cash on Delivery" className=''>Cash on Delivery</option>
                        <option value="Prepaid" className=''>Prepaid</option>
                        <option value="Cancelled" className=''>Cancelled</option>
                        <option value="Delivered" className=''>Delivered</option>
                    </select>
                </>
            ),
            action: (
                <>
                    {/* <Link className=''>Edit</Link> */}
                    <button onClick={() => showModal(orderState[i]?._id)} className='ms-3 modalFix'>
                            <MdDelete className='fs-4 text-danger mb-1 '/>
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
                    title="Are you sure you want to delete this order?"
                    open={open}
                    handleCancel={handleCancel}
                    performAction={() => {handleDeleteOrder(orderId)}}
                    selectedOrderId={selectedOrder}
                />
            </div>
        </>
    )
}

export default Orders;


