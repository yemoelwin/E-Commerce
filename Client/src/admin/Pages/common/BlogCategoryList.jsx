import React,{ useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { getBlogCategory } from '../../../features/blogCategory/blogCategorySlice';


const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Title",
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

const BlogCategoryList = () => {
    const dispatch = useDispatch();
    const blogCategoryState = useSelector((state) => state.blogCategory.blogCategories);

    useEffect(() => {
        dispatch(getBlogCategory());
    }, [dispatch]);
    const data1 = [];
    for (let i = 0; i < blogCategoryState.length; i++) {
        data1.push({
            key: i + 1,
            title: blogCategoryState[i].title,
            views: blogCategoryState[i].numSearchs,
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
                <h3 className="mb-4 title">Blog Category Lists</h3>
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

export default BlogCategoryList