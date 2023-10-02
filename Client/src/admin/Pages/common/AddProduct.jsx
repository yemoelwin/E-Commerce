import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Select from 'react-select';
import { getBrands } from '../../../features/brand/brandSlice';
import { getAllCategory } from '../../../features/category/categorySlice';
import { getColors } from '../../../features/color/colorSlice';
import { deleteImages, productImgUpload, removeImage } from '../../../features/upload/uploadSlice';
import { createProduct, fetchProductData, productResetState, updateProductData } from '../../../features/products/productSlice';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { showToast } from '../../../components/common/ShowToast';

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
    const location = useLocation();
    const brandState = useSelector((state) => state.brand.brands);
    const categoryState = useSelector((state) => state.category.categories);
    const colorState = useSelector((state) => state.color.colors);
    const imageState = useSelector((state) => state.uploadImg.prodimages);
    const [imageStateLoading, setImageStateLoading] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(false);
    const [selectedColors, setSelectedColors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const productIdSegment = location.pathname.split('/')[3];
    const productId = productIdSegment === 'undefined' ? undefined : productIdSegment;
    const newProduct = useSelector((state) => state.product);
    const { isSuccess, isError, createdProduct, singleData } = newProduct;
    
    const singleDataOrDefault = singleData || {};

    useEffect(() => {
        try {
            dispatch(getBrands());
            dispatch(getAllCategory());
            dispatch(getColors())
            .then(() => {
                    setIsLoading(false); // Set isLoading to false after data is fetched
                })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Set isLoading to false even if there is an error
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); 
        } 
    }, [dispatch, newProduct]);

    useEffect(() => {
        if (productId !== undefined) {
            dispatch(fetchProductData(productId))
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
                setIsLoading(false);
            });
        } else {
            dispatch(productResetState());
            setIsLoading(false);
        }
    }, [dispatch,productId]);
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: singleDataOrDefault.title || "",
            description: singleDataOrDefault.description || "",
            price: singleDataOrDefault.price || "",
            brand: singleDataOrDefault.brand || "",
            category: singleDataOrDefault.category || "",
            tags: singleDataOrDefault.tags || "",
            color: singleDataOrDefault.color || "",
            quantity: singleDataOrDefault.quantity || "",
            images: singleDataOrDefault.images || "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            // alert(JSON.stringify(values));
            setSelectedColors(null);
            if (productId !== undefined) {
                try {
                    await dispatch(updateProductData({ id: productId, prodData: values }));
                    dispatch(productResetState());
                    dispatch(removeImage());
                    setTimeout(() => {
                        showToast('Product data has been updated successfully.')
                        navigate('/admin/product-lists')
                    }, 300);
                } catch (error) {
                    console.error('Error occurred while creating new product:', error);
                    setIsLoading(false);
                } 
            } else {
                try {
                    await dispatch(createProduct(values));
                    formik.resetForm();
                    dispatch(productResetState());
                    dispatch(removeImage());
                } catch (error) {
                    console.error('Error occurred while creating new product:', error);
                } 
            }
        },
    });

    useEffect(() => {
        if (isSuccess && createdProduct) {
            toast.success('New Product successfully created!');
        }
        if (isError) {
            toast.error('Something went wrong and cannot add.Try again.');
        }
    }, [createdProduct, isError, isSuccess]);

/*  --------------Image Part---------------  */
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
        formik.values.images = img;
    }, [img])

    const onDrop = useCallback(acceptedFiles => {
        const formData = new FormData();
        for (let i = 0; i < acceptedFiles.length; i++) {
            formData.append('images', acceptedFiles[i]);
        }
        try {
            setImageStateLoading(true);
            dispatch(productImgUpload(formData)).finally(() => {
                setImageStateLoading(false);
            });
        } catch (error) {
            console.log('Error while Uploading to Cloudinary', error);
        }
    }, []);

    const handleRemoveImage = async(public_id, index) => {
        await dispatch(deleteImages(public_id))
            .then(() => {
                const updatedImages = [...formik.values.images];
                updatedImages.splice(index, 1);
                formik.setFieldValue("images", updatedImages);
            })
            .catch((error) => {
                console.error("Error deleting image from Cloudinary", error);
            });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleImageLoad = (index) => {
        setLoadedImagesCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (loadedImagesCount === imageState.length) {
            setImageStateLoading(false);
        }
    }, [loadedImagesCount, imageState]);

/*  --------------Image Part---------------  */

/*  --------------Color Part---------------  */

    const colorOption = useMemo(() => {
        if (!Array.isArray(colorState)) {
            return []; // Return an empty array if imageState is not an array
        }
        return colorState?.map((i) => ({
            label: i.color,
            value: i._id,
        }));
    }, [colorState]);

    useEffect(() => {
        // formik.values.color = colorOption || "";
        setSelectedColors(formik.values.color || []);
    }, [formik.values.color]);

    const handleColorChange = (selectedOptions) => {
        setSelectedColors(selectedOptions);
        formik.setFieldValue("color", selectedOptions); // Set selected colors in formik
    };

    /*  --------------Color Part---------------  */

    return (
        <>
            <div className="container ">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="mb-4 header-name">
                            {productId !== undefined ? 'Update Product' : 'Add Product'}
                        </h2>

                        {isLoading ? ( // Show loading indicator when isLoading is true
                            <div className='loading gap-3'>
                                <div className='loading-spinner'></div>
                                <div className='load'>Loading ... </div>
                            </div> 
                        ) : (
                            <form onSubmit={formik.handleSubmit}>
                            {/* {isLoading ? ( // Show loading indicator when isLoading is true
                                <div className='loading gap-3'>
                                    <div className='loading-spinner'></div>
                                    <div className='load'>Loading ... </div>
                                </div> 
                            ) : (
                            <div> */}
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

                                {/* Brand */}
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

                                {/* Category */}
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

                                {/* Color */}
                                <div className="form-group mt-2">
                                        <label htmlFor="colorSelect" className='label-name'>Color</label>
                                            <Select
                                                isMulti
                                                allowClear
                                                name= 'color'
                                                className={`w-100 ${formik.touched.color && formik.errors.color ? 'is-invalid' : ''}`}
                                                placeholder="Select colors"
                                                value={selectedColors}
                                                onChange={handleColorChange}
                                                options={colorOption}
                                                onBlur={formik.handleBlur('color')}
                                            />
                                        {formik.touched.color && formik.errors.color && (
                                            <div className="invalid-feedback">
                                                {formik.errors.color}
                                            </div>
                                        )}
                                </div>

                                {/* Product Tags */}
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

                                {/* Product Price */}
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
                                
                                {/* Product Quantity */}
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

                                {/* image */}
                                <div className='mt-2'>
                                        <label htmlFor="imageUpload" className='label-name'>Image</label>
                                        <div className='bg-white product-border text-center'>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className='fs-6 p-5 dropzone_image'>
                                                    Drag 'n' drop some files here, or click to select files and upload
                                                </div>
                                                    
                                            </div>
                                        </div>
                                </div>
                                <div className="showimages d-flex flex-wrap gap-3 product-border bg-white p-3">
                                        {(Array.isArray(formik.values.images) && formik.values.images.length > 0) ? (
                                            formik.values.images.map((image, index) => (
                                                <div className=" position-relative" key={index}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(image.public_id, index)}
                                                        className="btn-close position-absolute btn-hover"
                                                        style={{ top: "5px", right: "5px" }}
                                                    ></button>
                                                    <img
                                                        src={image.url}
                                                        alt=""
                                                        width={200}
                                                        height={200}
                                                        onLoad={() => handleImageLoad(index)}
                                                    />
                                                </div>
                                            ))
                                        ) : imageStateLoading ? (
                                            // Show loading message if images are still loading
                                            <p className='pt-2 fs-6 display_color2'>Loading images...</p>
                                        ) : (
                                            // Show "No images to display" message if no images
                                            <p className='pt-2 fs-6 display_color1'>No images to display</p>
                                        )}

                                </div>

                                {/* Description */}
                                <div className='mt-2'>
                                        <label htmlFor="productDescription" className='label-name'>Description</label>
                                        <textarea
                                            className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                            name="description"
                                            id="description"
                                            onChange={formik.handleChange("description")}
                                            onBlur={formik.handleBlur("description")}
                                            value={formik.values.description}
                                            rows={4} // Adjust the number of rows as needed
                                        />
                                </div>
                                <div className='error'>
                                    {formik.touched.description && formik.errors.description}
                                </div>

                                <button type="submit" className="btn btn-success btn-block mt-4">
                                    { productId !== undefined ? 'Update' : 'Add Product'}        
                                </button>        
                            
                            {/* )} */}
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddProduct;

    // const handleImgChange = async (event) => {
    //     const files = event.target.files;
    //     const formData = new FormData();     
    //     for (let i = 0; i < files.length; i++) {
    //         formData.append('images', files[i]);
    //     }
    //     try {    
    //         setImageStateLoading(true);
    //         await dispatch(productImgUpload(formData))
    //         // setFileList(Array.from(files)); // Convert files to an array for rendering
    //     } catch (error) {
    //         console.error("Error while uploading:", error);
    //     }  finally {
    //     setImageStateLoading(false);
    //     }
    // };   
