import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { CustomModal } from '../../../components/common/CustomModal';
import { MdDelete } from 'react-icons/md';
import { deleteCoupon, getCoupons } from '../../../features/coupon/couponSlice';
import { showToast } from '../../../components/common/ShowToast';

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
    {
        title: "Action",
        dataIndex: "action",
        // sorter: (a, b) => (a.discount || "").toString().localeCompare((b.discount || "").toString()),
    },
];

const CouponList = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [couponId, setCouponId] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const couponState = useSelector((state) => state.coupon.coupons);

    useEffect(() => {
        setIsLoading(true);
        const fetchCoupons = async () => {
            try {
                await dispatch(getCoupons());
            } catch (error) {
                console.error('Error fetching all coupon:', error);
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
        }
        fetchCoupons();
    }, []);

    const showModal = (e) => {
        setOpen(true);
        setCouponId(e);
        const Coupon = couponState.find((coupon) => coupon._id === (e));
        setSelectedCoupon(Coupon ? Coupon.code : '');
    }

    const deleteItem = (e) => {
        dispatch(deleteCoupon(e))
        .then(() => {
            showToast('You delete the coupon succesfully.')
            dispatch(getCoupons());
            })
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

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
                    <button onClick={() => showModal(couponState[i]._id)} className='ms-3 modalFix'>
                        <MdDelete className='fs-5 text-danger mb-1 '/>
                    </button>
                    
                </>
            ),
        });
    }
    return (
        <div>
                <h3 className="mb-4 title">Coupon Lists</h3>
                <div>
                    {isLoading ? ( // Show loading indicator when isLoading is true
                        <div className='loading gap-3'>
                            <div className='loading-spinner'></div>
                            <div className='load'>Loading ... </div>
                        </div> 
                    ) : (
                        <Table columns={columns} dataSource={data1} />
                    )}
                </div>
                <CustomModal
                    title="Are you sure you want to delete this coupon?"
                    open={open}
                    handleCancel={handleCancel}
                    performAction={() => {deleteItem(couponId)}}
                    selectedCode={selectedCoupon}
                />
        </div>
    )
}

export default CouponList;