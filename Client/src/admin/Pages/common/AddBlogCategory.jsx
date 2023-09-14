import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBlogCategory, resetState } from '../../../features/blogCategory/blogCategorySlice';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
});

const AddBlogCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newBlogCategory = useSelector((state) => state.blogCategory);
    const { isSuccess, isError, createdBlogCategory } = newBlogCategory;
    
    const formik = useFormik({
        initialValues: {
            title: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                dispatch(createBlogCategory(values));
                formik.resetForm();
                setTimeout(() => {
                    dispatch(resetState());
                    navigate('/admin/blog-category-list');
                },[2000])
            } catch (error) {
                throw new Error();
            }
        }
    })

    useEffect(() => {
        if (isSuccess && createdBlogCategory) {
            toast.success('New blog category added successfully.')
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.')
        }
        
    }, [isSuccess, isError, createdBlogCategory])
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                                <h2 className="mb-4 header-name">Add Blog Category</h2>

                                <div className="form-group mt-2">
                                    <label htmlFor="blogcategory" className='label-name'>Blog Category Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                        id="blogcategory"
                                        name='title'
                                        placeholder= 'Enter Blog Category Title'
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

                                <button type="submit" className="btn btn-success btn-block mt-4">Add Blog Category</button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddBlogCategory;