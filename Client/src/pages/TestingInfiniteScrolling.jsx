import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import IsLoading from "../containers/common/IsLoading";

const InfiniteScrolling = () => {
	const [items, setItems] = useState(Array.from({ length: 5 }));
	const [hasMore, setState] = useState(true);
	const fetchData = () => {
		if (items.length >= 50) {
			setState(false);
			return;
		}
		setTimeout(() => {
			setItems(items.concat(Array.from({ length: 3 })));
		}, 1500);
	};

	return (
		<>
			<InfiniteScroll
				dataLength={items.length} //This is important field to render the next data
				next={fetchData}
				hasMore={hasMore}
				loader={
					<h4>
						<IsLoading />
					</h4>
				}
				endMessage={
					<p style={{ textAlign: "center" }}>
						<b>Yay! You have seen it all</b>
					</p>
				}
			>
				{items.map((i, index) => (
					<div style={{ textAlign: "center" }} key={index}>
						div - #{index}
					</div>
				))}
			</InfiniteScroll>
		</>
	);
};

export default InfiniteScrolling;
