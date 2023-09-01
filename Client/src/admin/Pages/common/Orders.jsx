import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../../features/auth/AuthSlice';
import { MdDelete } from 'react-icons/md';
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
    },
    {
        title: "Customer Name",
        dataIndex: "customerName",
    },
    {
        title: "Total Amount",
        dataIndex: "amount",
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
    const orderState = useSelector((state) => state.auth.orders);
    useEffect(() => {
        dispatch(fetchOrders());
    },[dispatch]);
    const data1 = [];
    for (let i = 0; i < orderState.length; i++) {
        const createdAtDate = new Date(orderState[i].createdAt);
        const formattedDate = createdAtDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit',
            // second: '2-digit',
        });
        data1.push({
            key: i + 1,
            orderId: orderState[i]._id,
            date: formattedDate,
            customerName: orderState[i].orderby.firstname,
            // amount: `${orderState[i].payment.amount}`,
            status: (
                <>
                    <select name="" id='' className='form-control form-select'>
                        <option value="" className=''>Set Status</option>
                    </select>
                </>
            ),
            action: (
                <>
                    <Link className=''>Edit</Link>
                    <Link className='ms-3'><MdDelete  className='fs-5 text-danger mb-1 '/></Link>
                </>
            ),
        });
    }
    return (
        <>
            <div>
                <h3 className="mb-4 title">Order Lists</h3>
                <div>
                    <Table columns={columns} dataSource={data1} />
                </div>
            </div>
        </>
    )
}

export default Orders;


// {/* <CustomModal
//                     hideModal={hideModal}
//                     open={open}
//                     performAction={() => {
//                     deleteEnq(enqId);
//                     }}
//                     title="Are you sure you want to delete this enquiry?"
//                 /> */}