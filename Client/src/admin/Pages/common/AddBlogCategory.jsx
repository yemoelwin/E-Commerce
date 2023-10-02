import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { blogCategoryResetState, createBlogCategory, getBlogCategory, updateBlogCategory } from '../../../features/blogCategory/blogCategorySlice';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
});

const AddBlogCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const blogCatgoryIdSegment = location.pathname.split('/')[3];
    const blgCategoryId = blogCatgoryIdSegment === 'undefined' ? undefined : blogCatgoryIdSegment;
    const newBlogCategory = useSelector((state) => state.blogCategory);
    const { isSuccess, isError, createdBlogCategory, blogCatName, updatedCategory } = newBlogCategory;
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: blogCatName || "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                if (blgCategoryId !== undefined) {
                    await dispatch(updateBlogCategory({ id: blgCategoryId, blgCatgoryData: values }));
                    dispatch(blogCategoryResetState());
                    setTimeout(() => {
                        navigate('/admin/blog-category-list');
                    }, [250]);
                    formik.resetForm();
                } else {
                    await dispatch(createBlogCategory(values));
                    setTimeout(() => {
                        dispatch(blogCategoryResetState());
                    }, [200]);
                    formik.resetForm();
                }
            } catch (error) {
                throw new Error();
            }
        }
    })

    useEffect(() => {
        if (isSuccess && createdBlogCategory) {
            toast.success('New blog category added successfully.');
        }
        if (isSuccess && updatedCategory) {
            toast.success('Blog category has been updated successfully.');
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.');
        }
        
    }, [isSuccess, isError, createdBlogCategory, updatedCategory]);

    useEffect(() => {
        if (blgCategoryId !== undefined) {
            dispatch(getBlogCategory(blgCategoryId));
        } else {
            dispatch(blogCategoryResetState());
        }
    },[blgCategoryId])
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                                <h2 className="mb-4 header-name">
                                    {blgCategoryId !== undefined ? 'Update' : "Add "} Blog Category
                                </h2>

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

                            <button type="submit" className="btn btn-success btn-block mt-4">
                                {blgCategoryId !== undefined ? 'Update' : "Add Blog Category"} 
                            </button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddBlogCategory;