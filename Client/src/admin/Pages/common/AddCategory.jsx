import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { categoryResetState, createCategory, getCategory, updateCategory } from '../../../features/category/categorySlice';
import { showToast } from '../../../components/common/ShowToast';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
});

const AddCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const categoryIdSegment = location.pathname.split('/')[3];
    const categoryId = categoryIdSegment === 'undefined' ? undefined : categoryIdSegment;
    const newCategory = useSelector((state) => state.category);
    const { categoryName } = newCategory;
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: categoryName || "",
        },
        validationSchema: schema,
        onSubmit: async(values) => {
            try {
                if (categoryId !== undefined) {
                    const data = { id: categoryId, CategoryData: values };
                    await dispatch(updateCategory(data));
                    showToast('Product category updated succesfully.')
                    navigate(`/admin/category-lists`);
                    setTimeout(() => {
                        dispatch(categoryResetState());
                    }, [0])
                } else {
                    await dispatch(createCategory(values));
                    showToast('New category added successfully.')
                }
                formik.resetForm();
            } catch (error) {
                showToast('Something went wrong and cannot add.Try again.')
            }
        }
    })

    useEffect(() => {
        if (categoryId !== undefined) {
            dispatch(getCategory(categoryId));
        } else {
            dispatch(categoryResetState());
        }
    }, [categoryId])
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                            <h2 className="mb-4 header-name">{categoryId ? "Update" : "Add"} Category</h2>

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

                            <button type="submit" className="btn btn-success btn-block mt-4">
                                {categoryId ? "Update" : "Add"} Category</button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddCategory;