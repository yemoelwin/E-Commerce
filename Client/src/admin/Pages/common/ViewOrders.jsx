import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { getOrderbyUser } from '../../../features/auth/AuthSlice';
import { MdDelete } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';

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
        dataIndex: 'quantity',
    },
];

const ViewOrders = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const orderId = location.pathname.split('/')[3];
    const orderProductState = useSelector((state) => state.auth.orderProduct);
    console.log(orderProductState)
    // console.log(orderProductState?.products?.product.color[0].label);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (orderId !== undefined) {
                    setIsLoading(true);
                    // await dispatch(getOrderbyUser(orderId));
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [orderId]);

    const goBack = () => {
        navigate(-1);
    }
    
    const data1 = [];
    for (let i = 0; i < orderProductState?.products.length; i++) {
        const product = orderProductState?.products[i].product;
        const colors = product?.color.map((colorObj) => colorObj.label).join(', '); // Extract color labels and join them
        data1.push({
            key: i + 1,
            productId: orderProductState?.products[i]?.product?._id,
            productName: orderProductState?.products[i]?.product?.title,
            brand: orderProductState?.products[i]?.product?.brand,
            color: colors,
            price: `$ ${orderProductState?.products[i]?.price}`,
            quantity: orderProductState?.products[i]?.count,
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
                <div className='d-flex justify-content-between align-items-center'>
                    <h3 className='mb-4 title'>View Order</h3>
                    <button
                        onClick={goBack}
                        className='bg-transparent border-0 fs-6 align-items-center d-flex gap-1 gobackColor'>
                        <BiArrowBack className='fs-5 mt-1 gobackColor'/>Go Back
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
    )
}

export default ViewOrders;
