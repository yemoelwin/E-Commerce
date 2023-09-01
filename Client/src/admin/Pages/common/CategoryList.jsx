import React, { useEffect } from 'react';
import { Table } from "antd";
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '../../../features/category/categorySlice';

const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "title",
        sorter: (a, b) => a.title.localeCompare(b.title) || b.title.localeCompare(a.title),
    },
    {
        title: "Total Views",
        dataIndex: "views",
    },
    {
        title: "Action",
        dataIndex: "action",
    },
];

const CategoryList = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state) => state.category.categories);
    useEffect(() => {
        dispatch(getCategory());
    }, [dispatch]);
    const data1 = [];
    for (let i = 0; i < categoryState.length; i++) {
        data1.push({
            key: i + 1,
            title: categoryState[i].title,
            views: categoryState[i].numSearchs,
            action: (
                <>
                    <Link className=''>Edit</Link>
                    <Link className='ms-3'><MdDelete  className='fs-5 text-danger mb-1 '/></Link>
                </>
            ),
        });
    }
    return (
        <div>
                <h3 className="mb-4 title">Product Category Lists</h3>
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

export default CategoryList;