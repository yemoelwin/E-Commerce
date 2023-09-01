import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { getBlog } from '../../../features/blog/blogSlice';



const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Title",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name) || b.name.localeCompare(a.name),
    },
    {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b) => a.category.localeCompare(b.category) || b.category.localeCompare(a.category),
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

const BlogList = () => {
    const dispatch = useDispatch();
    const blogState = useSelector((state) => state.blog.blogs);
    console.log('blogState', blogState);
    useEffect(() => {
        dispatch(getBlog());
    }, [dispatch]);
    const data1 = [];
    for (let i = 0; i < blogState.length; i++) {
        data1.push({
            key: i + 1,
            name: blogState[i].title,
            category: blogState[i].category,
            views: blogState[i].numViews,
            action: (
                <>
                    <Link to='' className=''>Edit</Link>
                    <Link to='' className='ms-3'><MdDelete  className='fs-5 text-danger mb-1 '/></Link>
                </>
            ),
        });
    }
    return (
        <>
            <div>
                <h3 className="mb-4 title">Blog Lists</h3>
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
        </>
    )
}

export default BlogList