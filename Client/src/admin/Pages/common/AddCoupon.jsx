import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { couponResetState, createNewCoupon } from '../../../features/coupon/couponSlice';
import { showToast } from '../../../containers/common/ShowToast';


let schema = yup.object().shape({
    expiry: yup.string().required("Date is Required"),
    discount: yup.string().required("Discount is Required"),
});

const AddCoupon = () => {
    const dispatch = useDispatch();
    // const newCoupon = useSelector((state) => state.coupon);
    
    const formik = useFormik({
        initialValues: {
            expiry: "",
            discount:"",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                dispatch(createNewCoupon(values));
                showToast(('New coupon added successfully.'))
                formik.resetForm();
                setTimeout(() => {
                    dispatch(couponResetState());
                }, [300]);
            } catch (error) {
                showToast('Something went wrong and cannot add.Try again.')
            }
        }
    })
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                                <h2 className="mb-4 header-name">Add Coupon</h2>

                                <div className="form-group mt-2">
                                    <label htmlFor="expiryDate" className='label-name'>Expiry Date</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-control ${formik.touched.expiry && formik.errors.expiry ? 'is-invalid' : ''}`}
                                        id="date"
                                        name='expiry'
                                        placeholder= 'Enter Date'
                                        onChange={formik.handleChange("expiry")}
                                        onBlur={formik.handleBlur("expiry")}
                                        value={formik.values.expiry}
                                    required />
                                    {formik.touched.expiry && formik.errors.expiry && (
                                        <div className="invalid-feedback">
                                            {formik.errors.expiry}
                                        </div>
                                    )}
                                </div>
                            
                                <div className="form-group mt-2">
                                    <label htmlFor="discount" className='label-name'>Discount</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.discount && formik.errors.discount ? 'is-invalid' : ''}`}
                                        id="discount"
                                        name='discount'
                                        placeholder= 'Enter Discount'
                                        onChange={formik.handleChange("discount")}
                                        onBlur={formik.handleBlur("discount")}
                                        value={formik.values.discount}
                                        required />
                                    {formik.touched.discount && formik.errors.discount && (
                                        <div className="invalid-feedback">
                                            {formik.errors.discount}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-success btn-block mt-4">Add Coupon</button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddCoupon;