import React from 'react';
import { Modal } from 'antd';

export const CustomModal = (props) => {
    const { open, handleCancel, performAction, title, selectedBrandName } = props;

    return (
        <Modal
        title={title}
        open={open}
        onOk={performAction}
        onCancel={handleCancel}
        >
        <p className='spanSelectedBrand'>Brand Name : <span className='selectedBrand'>{selectedBrandName}</span></p>
        </Modal>
    )
}
