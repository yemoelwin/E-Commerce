import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryResetState, createCategory } from '../../../features/category/categorySlice';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
});

const AddCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newCategory = useSelector((state) => state.category);
    const { isSuccess, isError, createdCategory } = newCategory;
    
    const formik = useFormik({
        initialValues: {
            title: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                dispatch(createCategory(values));
                formik.resetForm();
                setTimeout(() => {
                    dispatch(categoryResetState());
                    navigate('/admin/category-lists')
                },[2000])
            } catch (error) {
                throw new Error();
            }
        }
    })

    useEffect(() => {
        if (isSuccess && createdCategory) {
            toast.success('New category added successfully.')
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.')
        }
        
    }, [isSuccess, isError, createdCategory])
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                                <h2 className="mb-4 header-name">Add Category</h2>

                                <div className="form-group mt-2">
                                    <label htmlFor="categoryTitle" className='label-name'>Category Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                        id="categoryTitle"
                                        name='title'
                                        placeholder= 'Enter Category Title'
                                        onChange={formik.handleChange("title")}
                                        onBlur={formik.handleBlur("title")}
                                        value={formik.values.title}
                                        required />
                                    {formik.touched.title && formik.errors.title && (
                                        <div className="invalid-feedback">
                                            {formik.errors.title}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-success btn-block mt-4">Add Category</button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddCategory;