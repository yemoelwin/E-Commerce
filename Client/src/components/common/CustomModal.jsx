// import React from 'react';
// import { Modal } from 'antd';

// export const CustomModal = (props) => {
//     const { open, handleCancel, performAction, title, selectedBrandName, selectedCategoryName } = props;

//     // const selectedPropKey = Object.keys(selectedProps).find((propKey) => selectedProps[propKey]);

//     // // Determine the label based on the selected property
//     // const label = selectedPropKey ? selectedPropKey.replace("selected", "") : "";
//     let itemType;
//     if (selectedCategoryName) {
//         itemType = 'Category Name:'
//     } else if (selectedBrandName) {
//         itemType = 'Brand Name:'
//     } else {
        
//     }
//     return (
//         <Modal
//         title={title}
//         open={open}
//         onOk={performAction}
//         onCancel={handleCancel}
//         >
//         {itemType && (
//             <p className='spanSelectedItem'>{itemType} <span className='selectedItem'>{selectedBrandName || selectedCategoryName}</span></p>
//         )}
//         </Modal>
//     )
// }
import React from 'react';
import { Modal } from 'antd';

export const CustomModal = (props) => {
    const { open, handleCancel, performAction, title, ...selectedProps } = props;

    // Find the first defined selected property
    const selectedPropKey = Object.keys(selectedProps).find((propKey) => selectedProps[propKey]);

    // Determine the label based on the selected property
    const label = selectedPropKey ? selectedPropKey.replace("selected", "") : "";

    return (
        <Modal
            // title={`${label ? `${label}:` : ""} ${selectedProps[selectedPropKey] || ""}`}
            title={title}
            open={open}
            onOk={performAction}
            onCancel={handleCancel}
        >
            {selectedProps[selectedPropKey] && (
                <p className='spanSelectedItem'>
                    {label} : <span className='selectedItem'>{selectedProps[selectedPropKey]}</span>
                </p>
            )}
        </Modal>
    );
};

