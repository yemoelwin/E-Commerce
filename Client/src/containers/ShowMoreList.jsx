import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clearSearchState } from "../features/products/productSlice";

const ShowMoreList = ({
	brands,
	categories,
	option,
	setCategory,
	setBrand,
	setTag,
	setMinPrice,
	setMaxPrice,
}) => {
	const dispatch = useDispatch();

	const maxItemsToShow = 6;

	const [selectedItem, setSelectedItem] = useState(null);

	const [showAll, setShowAll] = useState(false);

	const clearFilterState = () => {
		setTag("");
		setMinPrice("");
		setMaxPrice("");
	};

	const handleFilterOption = async (itemName) => {
		await dispatch(clearSearchState());
		try {
			if (option === "Categories") {
				setCategory(itemName);
				setBrand("");
				clearFilterState();
			} else {
				setBrand(itemName);
				setCategory("");
				clearFilterState();
			}
		} catch (error) {
			console.error("error", error);
		}
		setSelectedItem(itemName);
	};

	const visibleCategoryItems = showAll
		? categories
		: categories.slice(0, maxItemsToShow);

	const visibleBrandItems = showAll ? brands : brands.slice(0, maxItemsToShow);

	return (
		<div
			className='side-bar-display'
			style={{ overflow: "hidden", transition: "height 0.3s" }}
		>
			{(option === "Categories" ? visibleCategoryItems : visibleBrandItems).map(
				(item, index) => (
					<ul key={index} style={{ margin: 0, padding: 0 }}>
						<li
							className={`item-name ${
								selectedItem === item ? "selected-item" : ""
							}`}
							onClick={() => handleFilterOption(item)}
						>
							{item}
						</li>
					</ul>
				),
			)}

			<div className=''>
				{(categories ? categories : brands)?.length > maxItemsToShow && (
					<button
						className='see-more-button'
						onClick={() => setShowAll(!showAll)}
					>
						{showAll ? "See Less" : "See More"}
					</button>
				)}
			</div>
		</div>
	);
};

export default ShowMoreList;
