import React from 'react';
import CustomInput from '../../../components/common/CustomInput';

const AddBrand = () => {
    return (
        <>
            <div>
                <h3 className='title'>Add Brand</h3>
                <div>
                    <form action="">
                        <CustomInput type='text' label='Enter Brand' />
                        <button className='btn btn-success border-0 rounded my-4'>Add Brand</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddBrand;