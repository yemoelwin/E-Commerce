import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "antd";
import {
	deleteProduct,
	getProducts,
} from "../../../features/products/productSlice";
import { MdDelete } from "react-icons/md";
import { CustomModal } from "../../../containers/common/CustomModal";
import { showToast } from "../../../containers/common/ShowToast";

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
		sorter: (a, b) =>
			a.title.localeCompare(b.title) || b.title.localeCompare(a.title),
	},
	{
		title: "Brand",
		dataIndex: "brand",
		sorter: (a, b) =>
			a.brand.localeCompare(b.brand) || b.brand.localeCompare(a.brand),
	},
	{
		title: "Category",
		dataIndex: "category",
		sorter: (a, b) =>
			a.category.localeCompare(b.category) ||
			b.category.localeCompare(a.category),
	},
	{
		title: "Price",
		dataIndex: "price",
		sorter: (a, b) =>
			a.price.localeCompare(b.price) || b.price.localeCompare(a.price),
	},
	{
		title: "Quantity",
		dataIndex: "quantity",
	},
	{
		title: "Action",
		dataIndex: "action",
	},
];

const ProductList = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [productId, setProductId] = useState("");
	const [selectedProduct, setSelectedProduct] = useState("");
	const productState = useSelector((state) => state.product.products);

	useEffect(() => {
		setIsLoading(true);
		const fetchProducts = async () => {
			try {
				await dispatch(getProducts());
			} catch (error) {
				console.error("Error fetching products:", error);
			} finally {
				setIsLoading(false); // Set loading to false regardless of success or failure
			}
		};
		fetchProducts();
	}, []);

	const handleDeleteProduct = async (e) => {
		setIsLoading(true);
		try {
			setOpen(false);
			await dispatch(deleteProduct(e));
			await dispatch(getProducts());
			showToast("Product has been deleted successfully.");
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setIsLoading(false); // Set loading to false regardless of success or failure
		}
	};

	const showModal = (e) => {
		setOpen(true);
		setProductId(e);
		const fetchProduct = productState?.find((data) => data._id === e);
		setSelectedProduct(fetchProduct ? fetchProduct?.title : "");
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const data1 = [];
	let counter = 0;

	const sortedProductState = productState?.slice().sort((a, b) => {
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

	for (let i = 0; i < sortedProductState?.length; i++) {
		counter++;
		const title = sortedProductState[i]?.title;
		if (!title) {
			continue;
		}
		let truncatedTitle = title;
		if (title.length > 15) {
			// Truncate title if it's longer than 15 characters
			truncatedTitle = title.substr(0, 15);
			const lastSpaceIndex = truncatedTitle.lastIndexOf(" ");
			if (lastSpaceIndex !== -1) {
				truncatedTitle = truncatedTitle.substring(0, lastSpaceIndex); // Trim to the last space
			}
			truncatedTitle += "..."; // Add ellipsis
		}

		data1.push({
			key: counter,
			id: sortedProductState[i]?._id,
			title: truncatedTitle,
			brand: sortedProductState[i]?.brand,
			category: sortedProductState[i]?.category,
			// color: productState[i].color,
			price: `$ ${sortedProductState[i]?.price.toFixed(2)}`,
			quantity: sortedProductState[i]?.quantity,
			action: (
				<>
					<Link to={`/admin/edit-product/${sortedProductState[i]._id}`}>
						Edit
					</Link>
					<button
						onClick={() => showModal(sortedProductState[i]?._id)}
						className='ms-3 modalFix'
					>
						<MdDelete className='fs-4 text-danger mb-1 ' />
					</button>
				</>
			),
		});
	}
	return (
		<div>
			<h3 className='mb-4 title'>Product Lists</h3>
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
				title='Are you sure you want to delete this item?'
				open={open}
				handleCancel={handleCancel}
				performAction={() => {
					handleDeleteProduct(productId);
				}}
				selectedProductName={selectedProduct}
			/>
		</div>
	);
};

export default ProductList;
