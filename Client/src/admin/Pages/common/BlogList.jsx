import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { deleteBlog, getAllBlog } from "../../../features/blog/blogSlice";
import { CustomModal } from "../../../containers/common/CustomModal";
import { showToast } from "../../../containers/common/ShowToast";

const columns = [
	{
		title: "No",
		dataIndex: "key",
	},
	{
		title: "Title",
		dataIndex: "name",
		sorter: (a, b) =>
			a.name.localeCompare(b.name) || b.name.localeCompare(a.name),
	},
	{
		title: "Category",
		dataIndex: "category",
		sorter: (a, b) =>
			a.category.localeCompare(b.category) ||
			b.category.localeCompare(a.category),
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
	const [open, setOpen] = useState(false);
	const [blogId, setBlogId] = useState("");
	const [selectedBlog, setSelectedBlog] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const blogState = useSelector((state) => state?.blog?.blogs);

	useEffect(() => {
		setIsLoading(true);
		const fetchBlogs = async () => {
			try {
				await dispatch(getAllBlog());
			} catch (error) {
				console.error("Error fetching all blogs:", error);
			} finally {
				setIsLoading(false); // Set loading to false regardless of success or failure
			}
		};
		fetchBlogs();
	}, [dispatch]);

	const showModal = (e) => {
		setOpen(true);
		setBlogId(e);
		const selectedBlogItem = blogState?.find((blog) => blog._id === e);
		setSelectedBlog(selectedBlogItem ? selectedBlogItem.title : "");
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const deleteBlogItem = async (e) => {
		setIsLoading(true);
		try {
			setOpen(false);
			await dispatch(deleteBlog(e));
			await dispatch(getAllBlog());
			showToast("Blog item has been deleted successfully.");
		} catch (error) {
			console.error("Error while deleting blog:", error);
		} finally {
			setIsLoading(false); // Set loading to false regardless of success or failure
		}
	};

	const data1 = [];

	const sortedBlogState = blogState?.slice().sort((a, b) => {
		const numViewsA = a?.numViews;
		const numViewsB = b?.numViews;

		if (!isNaN(numViewsA) && !isNaN(numViewsB)) {
			return numViewsB - numViewsA;
		}

		return 0;
	});

	for (let i = 0; i < sortedBlogState?.length; i++) {
		const title = sortedBlogState[i]?.title;
		if (!title) {
			continue;
		}
		let truncatedTitle = title;
		if (title.length > 15) {
			// Truncate title if it's longer than 15 characters
			truncatedTitle = title.substr(0, 50);
			const lastSpaceIndex = truncatedTitle.lastIndexOf(" ");
			if (lastSpaceIndex !== -1) {
				truncatedTitle = truncatedTitle.substring(0, lastSpaceIndex); // Trim to the last space
			}
			truncatedTitle += "..."; // Add ellipsis
		}

		data1?.push({
			key: i + 1,
			name: truncatedTitle,
			category: sortedBlogState[i]?.category,
			views: sortedBlogState[i]?.numViews,
			action: (
				<>
					<Link to={`/admin/edit-blog/${sortedBlogState[i]._id}`} className=''>
						Edit
					</Link>
					<button
						className='ms-3 modalFix'
						onClick={() => showModal(sortedBlogState[i]._id)}
					>
						<MdDelete className='fs-5 text-danger mb-1' />
					</button>
				</>
			),
		});
	}
	return (
		<>
			<div>
				<h3 className='mb-4 title'>Blog Lists</h3>
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
					title='Are you sure you want to delete this brand?'
					open={open}
					handleCancel={handleCancel}
					performAction={() => {
						deleteBlogItem(blogId);
					}}
					selectedBlog={selectedBlog}
				/>
			</div>
		</>
	);
};

export default BlogList;
