import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addBrand, brandResetState, fetchBrand, updateBrand } from '../../../features/brand/brandSlice';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
});

const AddBrand = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const brandIdSegment = location.pathname.split('/')[3];
    const brandId = brandIdSegment === 'undefined' ? undefined : brandIdSegment;
    console.log('brandId', brandId);
    const newBrand = useSelector((state) => state.brand);
    const { isSuccess, isError, createdBrand, brandTitle, updatedBrand } = newBrand;
    console.log('brandTitle', brandTitle);

    useEffect(() => {
        if (brandId !== undefined) {
            dispatch(fetchBrand(brandId));
        } else {
            dispatch(brandResetState());
        }
    }, [brandId, dispatch]);

    const initialValues = {
        title: brandTitle || "",
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                if (brandId !== undefined) {
                    await dispatch(updateBrand({ id: brandId, data: values }));
                    dispatch(brandResetState());
                    setTimeout(() => {
                        navigate(`/admin/brand-lists`);
                    },[0])
                } else {
                    await dispatch(addBrand(values));
                    dispatch(brandResetState());
                    formik.resetForm();
                }
            } catch (error) {
                throw new Error();
            }
        }
    });

    useEffect(() => {
        if (isSuccess && createdBrand) {
            toast.success('Brand added successfully.');
        }
        if (isSuccess && updatedBrand) {
            toast.success('Brand updated successfully.');
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.');
        }
    }, [isSuccess, isError, updatedBrand]);

    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                            <h2 className="mb-4 header-name">
                                {brandId !== undefined ? 'Update Brand' : 'Add Brand'}
                            </h2>

                                <div className="form-group mt-2">
                                    <label htmlFor="brandTitle" className='label-name'>Brand Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                        id="brandTitle"
                                        name='title'
                                        placeholder= 'Enter Brand Title'
                                        onChange={formik.handleChange('title')}
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
                                {brandId !== undefined ? 'Update' : 'Add Brand'}
                            </button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddBrand;