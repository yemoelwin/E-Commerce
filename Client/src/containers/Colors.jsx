import React from "react";

const Colors = (props) => {
	const { colorData, setColor } = props;

	const handleColorClick = (label) => {
		setColor(label);
	};

	return (
		<>
			{colorData &&
				colorData?.color?.map((item, index) => {
					return (
						<ul className='colors ps-0' key={index}>
							<li
								onClick={() => handleColorClick(item.label)}
								style={{ backgroundColor: item?.label }}
							></li>
						</ul>
					);
				})}
		</>
	);
};

export default Colors;
