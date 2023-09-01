import React from 'react'
import CustomInput from '../../../components/common/CustomInput';

const AddBlogCategory = () => {
    return (
        <>
            <div>
                <h3 className='title'>Add Blog Category</h3>
                <div>
                    <form action="">
                        <CustomInput type='text' label='Enter Blog Category' />
                        <button className='btn btn-success border-0 rounded my-4'>Add Blog Category</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddBlogCategory