import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteCategory,
	getAllCategory,
} from "../../../features/category/categorySlice";
import { CustomModal } from "../../../containers/common/CustomModal";
import { showToast } from "../../../containers/common/ShowToast";

const columns = [
	{
		title: "No",
		dataIndex: "key",
	},
	{
		title: "Name",
		dataIndex: "title",
		sorter: (a, b) =>
			a.title.localeCompare(b.title) || b.title.localeCompare(a.title),
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
	const [open, setOpen] = useState(false);
	const [categoryId, setCategoryId] = useState("");
	const [selectedCategoryName, setSelectedCategoryName] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const categoryState = useSelector((state) => state.category.categories);

	useEffect(() => {
		setIsLoading(true);
		try {
			dispatch(getAllCategory());
		} catch (error) {
			console.error("Error fetching all categories:", error);
		} finally {
			setIsLoading(false); // Set loading to false regardless of success or failure
		}
	}, [dispatch]);

	const showModal = (e) => {
		setOpen(true);
		setCategoryId(e);
		const selectedCategory = categoryState.find(
			(category) => category._id === e,
		);
		setSelectedCategoryName(selectedCategory ? selectedCategory.title : "");
	};

	const deleteItem = (e) => {
		dispatch(deleteCategory(e))
			.then(() => {
				dispatch(getAllCategory());
				showToast("Product Category deleted successfully.");
			})
			.catch((error) => {
				console.log(error);
				showToast("Something went wrong and cannot add.Try again.");
			});
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const data1 = [];
	const sortedCategoryState = categoryState?.slice().sort((a, b) => {
		const titleA = a?.title?.toLowerCase();
		const titleB = b?.title?.toLowerCase();
		if (titleA < titleB) {
			return -1;
		}
		if (titleA > titleB) {
			return 1;
		}
		return 0;
	});

	for (let i = 0; i < sortedCategoryState.length; i++) {
		data1.push({
			key: i + 1,
			title: sortedCategoryState[i].title,
			views: sortedCategoryState[i].numSearchs,
			action: (
				<>
					<Link
						to={`/admin/edit-category/${sortedCategoryState[i]._id}`}
						className=''
					>
						Edit
					</Link>
					<button
						className='ms-3 modalFix'
						onClick={() => showModal(sortedCategoryState[i]._id)}
					>
						<MdDelete className='fs-5 text-danger mb-1' />
					</button>
				</>
			),
		});
	}

	return (
		<div>
			<h3 className='mb-4 title'>Product Category Lists</h3>
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
				title='Are you sure you want to delete this Category?'
				open={open}
				handleCancel={handleCancel}
				performAction={() => {
					deleteItem(categoryId);
				}}
				selectedCategoryName={selectedCategoryName}
			/>
		</div>
	);
};

export default CategoryList;
