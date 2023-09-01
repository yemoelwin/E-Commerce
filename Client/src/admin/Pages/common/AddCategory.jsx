import React from 'react';
import CustomInput from '../../../components/common/CustomInput';

const AddCategory = () => {
    return (
        <>
            <div>
                <h3 className='title'>Add Category</h3>
                <div>
                    <form action="">
                        <CustomInput type='text' label='Enter Category' />
                        <button className='btn btn-success border-0 rounded my-4'>Add Category</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddCategory;