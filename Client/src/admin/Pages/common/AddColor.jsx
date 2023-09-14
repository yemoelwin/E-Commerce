import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { colorResetState, createColor } from '../../../features/color/colorSlice';

let schema = yup.object().shape({
    color: yup.string().required("Color is Required"),
});

const AddColor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newColor = useSelector((state) => state.color);
    const { isSuccess, isError, createdColor } = newColor;
    
    const formik = useFormik({
        initialValues: {
            color: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                dispatch(createColor(values));
                formik.resetForm();
                setTimeout(() => {
                    dispatch(colorResetState());
                    navigate('/admin/color-lists')
                },[2000])
            } catch (error) {
                throw new Error();
            }
        }
    })

    useEffect(() => {
        if (isSuccess && createdColor) {
            toast.success('New color added successfully.')
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.')
        }
        
    }, [isSuccess, isError, createdColor])
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                                <h2 className="mb-4 header-name">Add Color</h2>

                                <div className="form-group mt-2">
                                    <label htmlFor="colorTitle" className='label-name'>Color</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.color && formik.errors.color ? 'is-invalid' : ''}`}
                                        id="colorTitle"
                                        name='color'
                                        placeholder= 'Enter Color'
                                        onChange={formik.handleChange("color")}
                                        onBlur={formik.handleBlur("color")}
                                        value={formik.values.color}
                                        required />
                                    {formik.touched.color && formik.errors.color && (
                                        <div className="invalid-feedback">
                                            {formik.errors.color}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-success btn-block mt-4">Add Color</button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddColor;