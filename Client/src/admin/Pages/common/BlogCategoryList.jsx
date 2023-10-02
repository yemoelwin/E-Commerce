import React,{ useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { deleteBlogCategory, getAllBlogCategory } from '../../../features/blogCategory/blogCategorySlice';
import { CustomModal } from '../../../components/common/CustomModal';
import { showToast } from '../../../components/common/ShowToast';

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
    const [open, setOpen] = useState(false);
    const [blogCategoryId, setBlogCategoryId] = useState('');
    const [selectedBlogCategory, setSelectedBlogCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const blogCategoryState = useSelector((state) => state.blogCategory.blogCategories);

    useEffect(() => {
        setIsLoading(true);
        const fetchAllBlogCategory = async () => {
            try {
                await dispatch(getAllBlogCategory());
                // dispatch(colorResetState());
            } catch (error) {
                console.error('Error fetching all BlogCategory:', error);
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
        }
        fetchAllBlogCategory();
    }, []);

    const showModal = (e) => {
        setOpen(true);
        setBlogCategoryId(e);
        const category = blogCategoryState?.find((blogName) => blogName._id === (e));
        setSelectedBlogCategory(category ? category.title : '');
    }

    const handleCancel = () => {
        setOpen(false);
    }

    const deleteItem = async (e) => {
        setIsLoading(true);
        try {
            setOpen(false);
            await dispatch(deleteBlogCategory(e))
            await dispatch(getAllBlogCategory())
            showToast('Blog Category has been deleted successfully.');
        } catch (error) {
            console.error('Error while deleting blog category:', error);
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or failure
        }
    }

    const data1 = [];
    for (let i = 0; i < blogCategoryState?.length; i++) {
        data1.push({
            key: i + 1,
            title: blogCategoryState[i]?.title,
            views: blogCategoryState[i]?.numSearchs,
            action: (
                <>
                    <Link to={`/admin/edit-blog-category/${blogCategoryState[i]?._id}`} className=''>Edit</Link>
                    <button className='ms-3 modalFix' onClick={() => showModal(blogCategoryState[i]?._id)}>
                        <MdDelete className='fs-5 text-danger mb-1' />
                    </button>
                </>
            ),
        });
    }
    return (
        <>
            <div>
                <h3 className="mb-4 title">Blog Category Lists</h3>
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
                    title="Are you sure you want to delete this blog category?"
                    open={open}
                    handleCancel={handleCancel}
                    performAction={() => {deleteItem(blogCategoryId)}}
                    selectedName={selectedBlogCategory}
                />
            </div>
        </>
    )
}

export default BlogCategoryList