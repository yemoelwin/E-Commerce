import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { getCoupons } from '../../../features/coupon/couponSlice';

const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Coupon Code",
        dataIndex: "code",
        sorter: (a, b) => a.code.localeCompare(b.code) || b.code.localeCompare(a.code),
    },
    {
        title: "Expiry Date",
        dataIndex: "date",
        sorter: (a, b) => a.date.localeCompare(b.date) || b.date.localeCompare(a.date),
    },
    {
        title: "Discount",
        dataIndex: "discount",
        sorter: (a, b) => (a.discount || "").toString().localeCompare((b.discount || "").toString()),
    },
];

const CouponList = () => {
    const dispatch = useDispatch();
    const couponState = useSelector((state) => state.coupon.coupons);
    useEffect(() => {
        dispatch(getCoupons());
    }, [dispatch]);

    const data1 = [];
    for (let i = 0; i < couponState.length; i++) {
        const date = new Date(couponState[i].expiry);
        data1.push({
            key: i + 1,
            code: couponState[i].code,
            date: date.toLocaleString(),
            discount: `${couponState[i].discount}%`,
            action: (
                <>
                    <Link className=''>Edit</Link>
                    <Link className='ms-3'><MdDelete className='fs-5 text-danger mb-1 '/></Link>
                </>
            ),
        });
    }
    return (
        <div>
                <h3 className="mb-4 title">Coupon Lists</h3>
                <div>
                    <Table columns={columns} dataSource={data1} />
                </div>
        </div>
    )
}

export default CouponList;