import React from 'react'

const Colors = (props) => {
    const { colorData, setColor } = props;
    // const [selectedColor, setSelectedColor] = useState(null);
    // let array = [];
    const handleColorClick = (label) => {
        // setSelectedColor(label); // Update the selected color
        // array.push(itemId, label)
        setColor(label); // Call the parent component's setColor function
    };


    return (
        <>
            {colorData && colorData?.color?.map((item, index) => {
                return (
                    // <div>
                        
                        <ul className='colors ps-0' key={index}>
                            <li
                                onClick={() => handleColorClick(item.label)}
                                style={{ backgroundColor: item?.label }}
                            ></li>
                        </ul>    
                    // </div>
                )
            })}
            {/* <div>Selected Color: {selectedColor}</div> */}
            
            
        </>
    )
}

export default Colors