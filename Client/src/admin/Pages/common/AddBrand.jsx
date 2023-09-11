import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBrand } from '../../../features/brand/brandSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
});

const AddBrand = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newBrand = useSelector((state) => state.brand);
    const { isSuccess, isError, createdBrand } = newBrand;
    
    const formik = useFormik({
        initialValues: {
            title: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                dispatch(createBrand(values));
                formik.resetForm();
                // toast.success('New brand added successfully.')
                setTimeout(() => {
                    navigate('/admin/brand-lists')
                    
                },[2000])
            } catch (error) {
                throw new Error();
            }
        }
    })

    useEffect(() => {
        if (isSuccess && createdBrand) {
            toast.success('New brand added successfully.')
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.')
        }
        
    }, [isSuccess, isError, createdBrand])
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                                <h2 className="mb-4 header-name">Add Brand</h2>

                                <div className="form-group mt-2">
                                    <label htmlFor="brandTitle" className='label-name'>Brand Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                        id="brandTitle"
                                        name='title'
                                        placeholder= 'Enter Brand Title'
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

                                <button type="submit" className="btn btn-success btn-block mt-4">Add Brand</button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddBrand;