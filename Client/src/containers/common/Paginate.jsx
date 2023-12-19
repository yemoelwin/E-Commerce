import React, { useEffect, useState } from "react";

import ReactPaginate from "react-paginate";

const Paginate = ({ items, perPage, setPaginateDisplay }) => {
	const [itemOffset, setItemOffset] = useState(0);

	const endOffset = itemOffset + perPage;

	const currentItems = items?.slice(itemOffset, endOffset);

	const pageCount =
		Array.isArray(items) && perPage && perPage > 0
			? Math.ceil(items.length / perPage)
			: 0;

	const handlePageClick = (e) => {
		const newOffset =
			Array.isArray(items) && perPage && perPage > 0
				? (e.selected * perPage) % items.length
				: 0;

		setItemOffset(newOffset);
	};

	useEffect(() => {
		if (typeof setPaginateDisplay === "function" && items) {
			setPaginateDisplay(currentItems);
		}
	}, [itemOffset, items]);

	return (
		<>
			<div className='react_paginate'>
				<ReactPaginate
					previousLabel='Previous'
					nextLabel='Next'
					pageClassName='page-item'
					pageLinkClassName='page-link'
					previousClassName='page-item'
					previousLinkClassName='page-link'
					nextClassName='page-item'
					nextLinkClassName='page-link'
					breakLabel='...'
					breakClassName='page-item'
					breakLinkClassName='page-link'
					pageCount={pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					onPageChange={handlePageClick}
					containerClassName='pagination'
					activeClassName='active'
				/>
			</div>
		</>
	);
};

export default Paginate;
