import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Select from 'react-select';
import { getBrands } from '../../../features/brand/brandSlice';
import { getCategory } from '../../../features/category/categorySlice';
import { getColors } from '../../../features/color/colorSlice';
import { deleteImages, uploadImages } from '../../../features/upload/uploadSlice';
import { createProduct } from '../../../features/products/productSlice';
import { useMemo } from 'react';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
    description: yup.string().required("Description is Required"),
    price: yup.number().required("Price is Required"),
    brand: yup.string().required("Brand is Required"),
    category: yup.string().required("Category is Required"),
    tags: yup.string().required("Tag is Required"),
    color: yup
        .array()
        .min(1, "Pick at least one color")
        .required("Color is Required"),
    quantity: yup.number().required("Quantity is Required"),
});

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [imageStateLoading, setImageStateLoading] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(false);
    const brandState = useSelector((state) => state.brand.brands);
    const categoryState = useSelector((state) => state.category.categories);
    const colorState = useSelector((state) => state.color.colors);
    const imageState = useSelector((state) => state.uploadImg.images);
    // const newProduct = useSelector((state) => state.product);
    // const { isSuccess, isError, products } = newProduct;
    
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            price: "",
            brand: "",
            category: "",
            tags: "",
            color: "",
            quantity: "",
            images: "",
        },
    validationSchema: schema,
        onSubmit: async (values) => {
            try {
                alert(JSON.stringify(values));
                dispatch(createProduct(values));
                toast.success('New Product successfully created!');
                // navigate('/admin/product-lists')
                formik.resetForm();
                setSelectedColors(null);
                setTimeout(() => {
                    // dispatch(resetState());
                    }, 3000);
            } catch (error) {
                toast.error("Something Went Wrong!");
            }
            
        },
    });

    useEffect(() => {
        dispatch(getBrands());
        dispatch(getCategory());
        dispatch(getColors())
    }, [dispatch]);

    

    const img = useMemo(() => {
        if (!Array.isArray(imageState)) {
            return []; // Return an empty array if imageState is not an array
        }
        return imageState.map((i) => ({
            url: i.url,
            asset_id: i.asset_id,
            public_id: i.public_id,
        }));
    }, [imageState]);

    useEffect(() => {
        setFileList(imageState);
    }, [imageState])

    const handleImageLoad = (index) => {
        setLoadedImagesCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (loadedImagesCount === imageState.length) {
            setImageStateLoading(false);
        }
    }, [loadedImagesCount, imageState]);

    const handleImgChange = (event) => {
        const files = event.target.files;
        const formData = new FormData();     
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        try {    
            setImageStateLoading(true);
            dispatch(uploadImages(formData)).finally(() => {
                setImageStateLoading(false);
            }) ;
            setFileList(Array.from(files)); // Convert files to an array for rendering
        } catch (error) {
            console.error("Error while uploading:", error);
        }
    };   

    const coloropt = useMemo(() => {
        if (!Array.isArray(colorState)) {
            return []; // Return an empty array if imageState is not an array
        }
        return colorState.map((i) => ({
            label: i.color,
            value: i._id,
        }));
    }, [colorState]);

    useEffect(() => {
        formik.values.images = img;
        formik.values.color = selectedColors ? selectedColors : " ";
    }, [img, formik.values, selectedColors]);
    
    const handleColors = (selectedOptions) => {
        setSelectedColors(selectedOptions)
    };

    useEffect(() => {
        setSelectedColors(colorState)
    },[colorState])

    // useEffect(() => {
    //     const formattedOptions = colorState.map((color) => ({
    //         value: color._id, // Replace with your actual data structure
    //         label: color.color, // Replace with your actual data structure
    //     }));
    //     setSelectedColors(formattedOptions);
    // },[colorState])

    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <form onSubmit={formik.handleSubmit}>
                            <h2 className="mb-4 header-name">Add Product</h2>

                            <div className="form-group mt-2">
                                <label htmlFor="productTitle" className='label-name'>Product Title</label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                    id="productTitle"
                                    name='title'
                                    placeholder= 'Enter Product Title'
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

                            <div className="form-group mt-2">
                                <label htmlFor="brandSelect" className='label-name'>Brand</label>
                                <select
                                    className={`form-control ${formik.touched.brand && formik.errors.brand ? 'is-invalid' : ''}`}
                                    id="brandSelect"
                                    name='brand'
                                    onChange={formik.handleChange("brand")}
                                    onBlur={formik.handleBlur("brand")}
                                    value={formik.values.brand}
                                    required
                                >
                                    <option>Choose Brand ...</option>
                                    {brandState.map((i, j) => {
                                        return (
                                            <option key={j} value={i.title}>{i.title}</option>
                                        )
                                    })}
                                </select>
                                {formik.touched.brand && formik.errors.brand && (
                                    <div className="invalid-feedback">
                                        {formik.errors.brand}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="categorySelect" className='label-name'>Category</label>
                                <select
                                    className={`form-control ${formik.touched.category && formik.errors.category ? 'is-invalid' : ''}`}
                                    id="categorySelect"
                                    name="category"
                                    onChange={formik.handleChange("category")}
                                    onBlur={formik.handleBlur("category")}
                                    value={formik.values.category}
                                    required
                                >
                                    <option value="">Choose Category ...</option>
                                    {categoryState.map((i, j) => {
                                        return (
                                            <option key={j} value={i.title}>{i.title}</option>
                                        )
                                    })}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <div className="invalid-feedback">
                                        {formik.errors.category}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="colorSelect" className='label-name'>Color</label>
                                    <Select
                                        isMulti
                                        allowClear
                                        name= 'color'
                                        className={`w-100 ${formik.touched.color && formik.errors.color ? 'is-invalid' : ''}`}
                                        placeholder="Select colors"
                                        value={formik.values.coloropt}
                                        onChange={handleColors}
                                        options={coloropt}
                                        onBlur={formik.handleBlur('color')}
                                    />
                                {formik.touched.color && formik.errors.color && (
                                    <div className="invalid-feedback">
                                        {formik.errors.color}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="TagSelect" className='label-name'>Tag</label>
                                <select
                                    className={`form-control ${formik.touched.tags && formik.errors.tags ? 'is-invalid' : ''}`}
                                    id="tagSelect"
                                    name="tags"
                                    onChange={formik.handleChange("tags")}
                                    onBlur={formik.handleBlur("tags")}
                                    value={formik.values.tags}
                                    required
                                >
                                    <option value="" disabled>Select Tag ...</option>
                                    <option value="featured">Featured</option>
                                    <option value="popular">Popular</option>
                                    <option value="special">Special</option>
                                </select>
                                {formik.touched.tags && formik.errors.tags && (
                                    <div className="invalid-feedback">
                                        {formik.errors.tags}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="productPrice" className='label-name'>Price</label>
                                <input
                                    type="number"
                                    id="productPrice"
                                    name='price'
                                    placeholder="Enter Product Price"
                                    className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange("price")}
                                    onBlur={formik.handleBlur("price")}
                                    value={formik.values.price}
                                    required />
                                
                                {formik.touched.price && formik.errors.price && (
                                    <div className="invalid-feedback">
                                        {formik.errors.price}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="productQuantity" className='label-name'>Quantity</label>
                                <input
                                    type="number"
                                    id="productQuantity"
                                    name='quantity'
                                    placeholder="Enter Product Quantity"
                                    className={`form-control ${formik.touched.quantity && formik.errors.quantity ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange("quantity")}
                                    onBlur={formik.handleBlur("quantity")}
                                    value={formik.values.quantity}
                                    required />
                                
                                {formik.touched.quantity && formik.errors.quantity && (
                                    <div className="invalid-feedback">
                                        {formik.errors.quantity}
                                    </div>
                                )}
                            </div>

                            <div className='mt-2'>
                                <label htmlFor="imageUpload" className='label-name'>Image Upload</label>
                                <div className='product-border bg-white p-3'>
                                    <input
                                        type="file"
                                        name='images'
                                        id='image'
                                        multiple
                                        onChange={handleImgChange}
                                    />
                                </div>
                            </div>
                            <div className="showimages d-flex flex-wrap gap-3 product-border bg-white p-3">
                                {Array.isArray(imageState) && imageState?.length > 0 ? (
                                    imageState?.map((i, j) => (
                                        <div className=" position-relative" key={j}>
                                            <button
                                                type="button"
                                                onClick={() => dispatch(deleteImages(i.public_id))}
                                                className="btn-close position-absolute btn-hover"
                                                style={{ top: "5px", right: "5px" }}
                                            ></button>
                                            <img src={i.url} alt="" width={200} height={200} onLoad={() => handleImageLoad(j)}/>
                                        </div>
                                    ))
                                ) : imageStateLoading ? (
                                    // Show loading message if images are still loading
                                    <p>Loading images...</p>
                                ) : (
                                    // Show "No images to display" message if no images
                                    <p>No images to display</p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <label htmlFor="productDescription" className='label-name'>Description</label>
                                <ReactQuill
                                    theme="snow"
                                    name="description"
                                    onChange={formik.handleChange("description")}
                                    value={formik.values.description}
                                />
                            </div>
                            <div className='error'>
                                {formik.touched.description && formik.errors.description}
                            </div>

                            <button type="submit" className="btn btn-success btn-block mt-4">Add Product</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddProduct;

