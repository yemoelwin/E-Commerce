import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { colorResetState, createColor, fetchColor, updateColor } from '../../../features/color/colorSlice';
import { showToast } from '../../../components/common/ShowToast';

let schema = yup.object().shape({
    color: yup.string().required("Color is Required"),
});

const AddColor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const colorIdSegment = location.pathname.split('/')[3];
    const colorId = colorIdSegment === 'undefined' ? undefined : colorIdSegment;
    // console.log(colorId);
    const newColor = useSelector((state) => state.color);
    const { colorName } = newColor;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            color: colorName || "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                if (colorId !== undefined) {
                    await dispatch(updateColor({ id: colorId, colorData: values }));
                    showToast('Color updated succesfully.');
                    setTimeout(() => {
                        navigate('/admin/color-lists');
                        dispatch(colorResetState());
                    }, [200]);
                } else {
                    dispatch(createColor(values));
                    showToast('Color added succesfully.');
                }
                formik.resetForm();
                setTimeout(() => {
                    dispatch(colorResetState());
                },[0])
            } catch (error) {
                throw new Error();
            }
        }
    })

    useEffect(() => {
        if (colorId !== undefined) {
            dispatch(fetchColor(colorId));
        } else {
            dispatch(colorResetState());
        }
    }, [colorId]);
    
    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={formik.handleSubmit}>
                            <h2 className="mb-4 header-name">
                                {colorId ? 'Edit Color' : 'Add Color'}
                            </h2>

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

                            <button type="submit" className="btn btn-success btn-block mt-4">
                                {colorId ? 'Update' : 'Add Color'}
                            </button>
                            </form>
                        </div>
                </div>
            </div>
        
        </>
    )
}

export default AddColor;