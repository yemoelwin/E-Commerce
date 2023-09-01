import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from "antd";
import { getProducts } from '../../../features/products/productSlice';
import { MdDelete } from 'react-icons/md';
// import { AiFillDelete } from 'react-icons/ai';

const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Product_id",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "title",
        sorter: (a, b) => a.title.localeCompare(b.title) || b.title.localeCompare(a.title),
    },
    {
        title: "Brand",
        dataIndex: "brand",
        sorter: (a, b) => a.brand.localeCompare(b.brand) || b.brand.localeCompare(a.brand),
    },
    {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b) => a.category.localeCompare(b.category) || b.category.localeCompare(a.category),
    },
    // {
    //     title: "Color",
    //     dataIndex: 'color',
    // },
    {
        title: "Price",
        dataIndex: "price",
        sorter: (a, b) => a.price.localeCompare(b.price) || b.price.localeCompare(a.price),
    },
    {
        title: "Quantity",
        dataIndex: "quantity",
    },
    {
        title: "Action",
        dataIndex: "action"
    },
];

const ProductList = () => {
    const dispatch = useDispatch();
    const productState = useSelector((state) => state.product.products);
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    const data1 = [];
    let counter = 0;
    for (let i = 0; i < productState.length; i++) {
        counter++;
        data1.push({
            key: counter,
            id: productState[i]._id,
            title: productState[i].title,
            brand: productState[i].brand,
            category: productState[i].category,
            // color: productState[i].color,
            price: `$ ${productState[i].price}`,
            quantity: productState[i].quantity,
            action:
                <>
                <Link className='fs-6 mb-2'>Edit</Link>
                <Link className=' fs-5'><MdDelete className='mb-0 ms-2 text-danger'/></Link>
                </>
        });
    }
    return (
        <div>
                <h3 className="mb-4 title">Product Lists</h3>
                <div>
                    <Table columns={columns} dataSource={data1} />
                </div>
                {/* <CustomModal
                    hideModal={hideModal}
                    open={open}
                    performAction={() => {
                    deleteEnq(enqId);
                    }}
                    title="Are you sure you want to delete this enquiry?"
                /> */}
            </div>
    )
}

export default ProductList;